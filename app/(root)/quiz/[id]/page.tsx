import Questions from "@/components/app-components/Questions";
import Delete from "@/components/shared/Delete";
import PageIntro from "@/components/shared/PageIntro";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { neon } from "@neondatabase/serverless";
import { Loader2, Pencil, Users } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";

export type Question = {
  id: string;
  quiz_id: string;
  question: string;
  options: string[];
};

const QuizPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id: quizId } = await params;
  if (!quizId || quizId.length !== 36) return notFound();
  const sql = neon(process.env.DATABASE_URL!);
  const quiz = await sql`SELECT * FROM quiz WHERE id = ${quizId}`;
  if (quiz.length === 0) return notFound();

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return redirect("/sign-in");

  return (
    <main className="wrapper">
      <PageIntro
        heading={quiz[0].title}
        description={quiz[0].description}
        image="image"
      />
      {session.user.role === "admin" || session.user.role === "superadmin" ? (
        <section className="rounded-md overflow-hidden">
          <h3 className="h5 text-primary p-5 pb-0 bg-card">Admin actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 p-5 pt-4 bg-card">
            <Button
              className="w-full min-h-16 text-primary border border-primary/20 hover:border-primary/30 bg-card dark:bg-background hover:bg-primary/10!"
              variant={"secondary"}
              asChild
            >
              <Link href={`/quiz/${quizId}/edit`}>
                <Pencil />
                Edit quiz
              </Link>
            </Button>
            <Button
              asChild
              className="w-full min-h-16 text-primary border border-primary/20 hover:border-primary/30 bg-card dark:bg-background hover:bg-primary/10!"
              variant={"secondary"}
            >
              <Link href={`/quiz/${quizId}/participants`}>
                <Users />
                Participants
              </Link>
            </Button>
            <Delete qid={quizId} />
          </div>
        </section>
      ) : (
        <Suspense
          fallback={
            <div className="p-5 min-h-42 fl_center">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          }
        >
          <Questions qid={quizId} uid={session.user.id} />
        </Suspense>
      )}
    </main>
  );
};

export default QuizPage;
