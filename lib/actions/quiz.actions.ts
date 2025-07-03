"use server";

import { neon } from "@neondatabase/serverless";
import { headers } from "next/headers";
import { auth } from "../auth";
import { revalidatePath } from "next/cache";
import {
  CreateQuestionType,
  UpdateQuestionType,
} from "@/components/shared/QuizForm";

type QuizFormCreateType = {
  name: string;
  description: string;
  questions: CreateQuestionType[];
};

type QuizFormUpdateType = {
  name: string;
  description: string;
  questions: UpdateQuestionType[];
};

const sql = neon(process.env.DATABASE_URL!);

export async function create_quiz({ data }: { data: QuizFormCreateType }) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role === "user") {
      throw new Error("Unauthorized");
    }

    const userId = session.user.id;
    const now = new Date().toISOString();

    // Set expiration date (e.g., 30 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);
    const expiresAtISO = expiresAt.toISOString();

    await sql`BEGIN`;

    try {
      const quizResult = await sql`
        INSERT INTO quiz (title, description, creator_id, created_at, updated_at, expires_at)
        VALUES (${data.name}, ${data.description}, ${userId}, ${now}, ${now}, ${expiresAtISO})
        RETURNING id
      `;

      if (!quizResult || quizResult.length === 0) {
        throw new Error("Failed to create quiz");
      }

      const quizId = quizResult[0].id;

      for (const question of data.questions) {
        await sql`
          INSERT INTO question (quiz_id, question, options, answer, created_at, updated_at)
          VALUES (
            ${quizId},
            ${question.question},
            ${JSON.stringify(question.options)},
            ${question.answer},
            ${now},
            ${now}
          )
        `;
      }
      await sql`COMMIT`;

      return {
        success: true,
        message: "Quiz created successfully",
        quizId: quizId,
      };
    } catch (transactionError) {
      await sql`ROLLBACK`;
      throw transactionError;
    }
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
    };
  }
}

export async function update_quiz({
  qid,
  data,
}: {
  qid: string;
  data: QuizFormUpdateType;
}) {
  try {
    if (!qid || qid.length !== 36) {
      throw new Error("Invalid quiz ID");
    }

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role === "user") {
      throw new Error("Unauthorized");
    }

    const now = new Date().toISOString();

    await sql`BEGIN`;

    try {
      const quizUpdate = await sql`
        UPDATE quiz
        SET
          title = ${data.name},
          description = ${data.description},
          updated_at = ${now}
        WHERE id = ${qid}
        RETURNING id
      `;

      if (!quizUpdate || quizUpdate.length === 0) {
        throw new Error("Failed to update quiz");
      }

      for (const question of data.questions) {
        if (!question.id) {
          throw new Error("Each question must have an ID to update");
        }

        await sql`
          UPDATE question
          SET
            question = ${question.question},
            options = ${JSON.stringify(question.options)},
            answer = ${question.answer},
            updated_at = ${now}
          WHERE id = ${question.id}
        `;
      }

      await sql`COMMIT`;
      revalidatePath(`/quiz/${qid}`);
      return {
        success: true,
        message: "Quiz updated successfully",
      };
    } catch (transactionError) {
      await sql`ROLLBACK`;
      throw transactionError;
    }
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
    };
  }
}

export type SubmissionType = {
  answers: Record<string, string>; // questionId -> selectedIndex as string
};

export async function submission({
  qid,
  data,
}: {
  qid: string;
  data: SubmissionType;
}) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new Error("Unauthorized - Please login");
    }

    const userId = session.user.id;
    const now = new Date().toISOString();

    // Check if user has already attempted this quiz
    const existingAttempt = await sql`
      SELECT * FROM attempt 
      WHERE user_id = ${userId} AND quiz_id = ${qid}
    `;

    if (existingAttempt.length > 0) {
      return {
        success: false,
        message: "You have already attempted this quiz",
      };
    }

    // Check if quiz exists and is not expired
    const quizResult = await sql`
      SELECT * FROM quiz 
      WHERE id = ${qid} AND expires_at > NOW()
    `;

    if (quizResult.length === 0) {
      return {
        success: false,
        message: "Quiz not found or has expired",
      };
    }

    // Get all questions for this quiz
    const questionsResult = await sql`
      SELECT id, answer FROM question 
      WHERE quiz_id = ${qid}
    `;

    if (questionsResult.length === 0) {
      return {
        success: false,
        message: "No questions found for this quiz",
      };
    }

    // Calculate score
    let correctAnswers = 0;
    const totalQuestions = questionsResult.length;

    for (const question of questionsResult) {
      const userAnswer = data.answers[question.id];
      const correctAnswer = question.answer;

      if (userAnswer && parseInt(userAnswer) === correctAnswer) {
        correctAnswers++;
      }
    }

    const scorePercentage = (correctAnswers / totalQuestions) * 100;

    await sql`BEGIN`;

    try {
      await sql`
        INSERT INTO attempt (user_id, quiz_id, score, created_at, updated_at)
        VALUES (${userId}, ${qid}, ${scorePercentage.toFixed(
        2
      )}, ${now}, ${now})
      `;

      await sql`COMMIT`;

      revalidatePath(`/quiz/${qid}`);

      return {
        success: true,
        message: "Quiz submitted successfully",
      };
    } catch (transactionError) {
      await sql`ROLLBACK`;
      throw transactionError;
    }
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
    };
  }
}

export async function generateQuizQuestions({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!title || !description) {
    throw new Error("Title and description are required");
  }

  if (!session) {
    throw new Error("Unauthorized - Please login");
  }

  if (session.user.role !== "admin" && session.user.role !== "superadmin") {
    throw new Error("Unauthorized - Only admins can generate questions");
  }

  const res = await fetch("http://localhost:3000/api/quiz/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, description }),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to generate questions");
  }

  return data.questions;
}

export async function generateQuizQuestionsFromPrompt(prompt: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized - Please login");
  }

  if (session.user.role !== "admin" && session.user.role !== "superadmin") {
    throw new Error("Unauthorized - Only admins can generate questions");
  }

  const res = await fetch("http://localhost:3000/api/quiz/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to generate questions");
  }

  return data.questions;
}

export async function delete_quiz(qid: string) {
  try {
    if (!qid || qid.length !== 36) throw new Error("Invalid quiz ID");
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (
      !session ||
      (session.user.role !== "admin" && session.user.role !== "superadmin")
    ) {
      throw new Error("Unauthorized");
    }

    const result = await sql`
      DELETE FROM quiz
      WHERE id = ${qid}
      RETURNING id
    `;

    if (!result || result.length === 0) {
      throw new Error("Quiz not found or already deleted");
    }

    return {
      success: true,
      message: "Quiz deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message || "An error occurred",
    };
  }
}
