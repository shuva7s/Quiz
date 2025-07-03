import PageIntro from "@/components/shared/PageIntro";
import QuizForm, { UpdateQuestionType } from "@/components/shared/QuizForm";
import { neon } from "@neondatabase/serverless";
import { Loader2 } from "lucide-react";
import { notFound } from "next/navigation";
import { Suspense } from "react";

async function Renderer({ qid }: { qid: string }) {
  const sql = neon(process.env.DATABASE_URL!);

  const quiz = await sql`SELECT * FROM quiz WHERE id = ${qid}`;

  const questions =
    await sql`SELECT * FROM question WHERE quiz_id = ${qid} ORDER BY created_at ASC`;

  if (quiz.length === 0 || questions.length === 0) {
    return <div>Not found</div>;
  }

  return (
    <section>
      <QuizForm
        type="update"
        qid={qid}
        quiz_name={quiz[0].title}
        quiz_description={quiz[0].description}
        questions={questions as UpdateQuestionType[]}
      />
    </section>
  );
}

const EditPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id: quizId } = await params;
  if (!quizId || quizId.length !== 36) return notFound();
  return (
    <main className="wrapper">
      <PageIntro
        heading="Edit quiz"
        description="Wanna change something? just edit it here and save it."
      />
      <Suspense
        fallback={
          <div className="p-5 min-h-42 fl_center">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        }
      >
        <Renderer qid={quizId} />
      </Suspense>
    </main>
  );
};

export default EditPage;
