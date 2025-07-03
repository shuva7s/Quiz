import PageIntro from "@/components/shared/PageIntro";
import QuizCard from "@/components/shared/QuizCard";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { Loader2, Plus } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { neon } from "@neondatabase/serverless";
import { Suspense } from "react";
import { redirect } from "next/navigation";

async function Renderer() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return redirect("/sign-in");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let quizzes: any[] = [];

  if (session) {
    const sql = neon(process.env.DATABASE_URL!);
    quizzes = await sql`SELECT * FROM quiz ORDER BY created_at DESC`;
    return (
      <section className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
        {(session?.user.role === "admin" ||
          session?.user.role === "superadmin") && (
          <Button
            asChild
            variant={"secondary"}
            className="w-full min-h-20 sm:min-h-72 text-primary border border-primary/20 hover:border-primary/30 bg-card dark:bg-background hover:bg-primary/10! duration-200"
          >
            <Link href="/create">
              <Plus className="size-6" />
              Create quiz
            </Link>
          </Button>
        )}
        {quizzes.length > 0 ? (
          <>
            {quizzes.map((quiz) => (
              <QuizCard key={quiz.id} {...quiz} />
            ))}
          </>
        ) : (
          <p className="text-muted-foreground">No quizzes to show</p>
        )}
      </section>
    );
  }
}

export default function Home() {
  return (
    <main className="wrapper">
      <PageIntro
        heading="Explore quizzes"
        description="Explore and play quizzes that will test your knowledge."
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
}
