import PageIntro from "@/components/shared/PageIntro";
import { auth } from "@/lib/auth";
import { neon } from "@neondatabase/serverless";
import { Loader2 } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import QuizCard from "@/components/shared/QuizCard";

async function Renderer() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) return redirect("/sign-in");

  const sql = neon(process.env.DATABASE_URL!);

  const quizzes = await sql`
  SELECT 
    attempt.*, 
    quiz.title AS quiz_title, 
    quiz.description AS quiz_description
  FROM attempt
  JOIN quiz ON attempt.quiz_id = quiz.id
  WHERE attempt.user_id = ${session.user.id}
  ORDER BY attempt.created_at DESC
`;

  // console.log(quizzes);

  return (
    <>
      {quizzes.length > 0 ? (
        <section className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
          {quizzes.map((quiz) => (
            <QuizCard
              id={quiz.quiz_id}
              key={quiz.quiz_id}
              title={quiz.quiz_title}
              description={quiz.quiz_description}
              score={quiz.score}
            />
          ))}
        </section>
      ) : (
        <div className="p-5 min-h-42 fl_center">
          <p className="text-muted-foreground">
            You have not attempted any quiz
          </p>
        </div>
      )}
    </>
  );
}

const HistoryPage = () => {
  return (
    <main className="wrapper">
      <PageIntro
        heading="Quiz history"
        description="Quizes you have attempted"
      />
      <Suspense
        fallback={
          <div className="p-5 min-h-42 fl_center">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        }
      >
        <Renderer />
      </Suspense>
    </main>
  );
};

export default HistoryPage;
