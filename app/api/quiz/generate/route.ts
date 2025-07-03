import { NextResponse } from "next/server";
import { z } from "zod";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Types
type Question = {
  id: string;
  question: string;
  options: string[];
  answer: number;
};

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const { title, description } = body;

//     if (!title || !description) {
//       throw new Error("MIssing prompt");
//     }

//     const formattedPrompt = `
// You are a quiz question generator.

// Your task is to generate multiple-choice questions based on the provided title and description.

// Each question must include:
// - "id": an empty string "".
// - "question": a clear, concise question as a string.
// - "options": an array of exactly 4 non-empty strings.
// - "answer": an integer (0 to 3) indicating the correct option's index.

// Important formatting rules:
// - Do NOT include any explanation or extra text.
// - Do NOT wrap the JSON output in triple backticks or markdown formatting.
// - Only output a pure JSON array — no prefix, no suffix.

// TITLE: "${title}"
// DESCRIPTION: "${description}"
// `;

//     const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//     const result = await model.generateContent(formattedPrompt);
//     const raw = result.response.text();

//     const schema = z.array(
//       z.object({
//         id: z.string(),
//         question: z.string(),
//         options: z.array(z.string()).length(4),
//         answer: z.number().int().gte(0).lt(4),
//       })
//     );

//     const questions: Question[] = schema.parse(JSON.parse(raw));

//     return NextResponse.json({ success: true, questions });
//   } catch (error) {
//     console.log("Gemini quiz generation error:", error);
//     return NextResponse.json(
//       {
//         success: false,
//         message:
//           error instanceof Error ? error.message : "Something went wrong.",
//       },
//       { status: 400 }
//     );
//   }
// }

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Accept only "prompt" now
    const inputSchema = z.object({
      prompt: z.string().min(1, "Prompt is required"),
    });
    const { prompt } = inputSchema.parse(body);

    const formattedPrompt = `
You are a quiz question generator.

Your task is to generate multiple-choice questions based on the provided prompt.

Each question must include:
- "id": an empty string "".
- "question": a clear, concise question as a string.
- "options": an array of exactly 4 non-empty strings.
- "answer": an integer (0 to 3) indicating the correct option's index.

Important formatting rules:
- Do NOT include any explanation or extra text.
- Do NOT wrap the JSON output in triple backticks or markdown formatting.
- Only output a pure JSON array — no prefix, no suffix.

PROMPT: "${prompt}"
`;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(formattedPrompt);
    const raw = result.response.text();

    const schema = z.array(
      z.object({
        id: z.string(),
        question: z.string(),
        options: z.array(z.string()).length(4),
        answer: z.number().int().gte(0).lt(4),
      })
    );

    const questions: Question[] = schema.parse(JSON.parse(raw));

    return NextResponse.json({ success: true, questions });
  } catch (error) {
    // console.error("Gemini quiz generation error:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Something went wrong.",
      },
      { status: 400 }
    );
  }
}
