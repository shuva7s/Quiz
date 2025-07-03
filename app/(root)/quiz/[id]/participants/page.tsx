import PageIntro from "@/components/shared/PageIntro";
import { neon } from "@neondatabase/serverless";
import { Loader2 } from "lucide-react";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const sql = neon(process.env.DATABASE_URL!);

async function Renderer({ qid }: { qid: string }) {
  const participants = await sql`
  SELECT 
    attempt.*, 
    "user".name AS user_name, 
    "user".email AS user_email, 
    "user".image AS user_image
  FROM attempt
  JOIN "user" ON attempt.user_id = "user".id
  WHERE attempt.quiz_id = ${qid}
  ORDER BY attempt.score DESC
`;

  return (
    <section className="bg-card p-5 rounded-md">
      <h3 className="h5 text-primary">Participants</h3>
      {participants.length > 0 ? (
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2">
          {participants.map((participant, i: number) => (
            <div
              key={participant.id + i}
              className={`flex gap-4 items-center relative ${
                i % 2 === 0 && "md:pr-5 md:border-r"
              }`}
            >
              <div
                className={`bg-primary text-white px-3 py-2 rounded-full text-sm font-semibold absolute right-0 top-1/2 -translate-y-1/2 z-10 ${
                  i % 2 === 0 && "md:right-5"
                }`}
              >
                {participant.score}
              </div>
              <Avatar className="size-15 sm:size-18">
                <AvatarImage
                  src={
                    participant.user_image || "https://github.com/shadcn.png"
                  }
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>

              <div>
                <p className="font-semibold line-clamp-1">
                  {participant.user_name}
                </p>
                <p className="text-muted-foreground text-sm -mt-1 line-clamp-1">
                  {participant.user_email}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-5 min-h-42 fl_center">
          <p className="text-muted-foreground">No participants yet</p>
        </div>
      )}
    </section>
  );
}

const QuizParticipants = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id: quizId } = await params;
  if (!quizId || quizId.length !== 36) return notFound();

  const quiz = await sql`SELECT * FROM quiz WHERE id = ${quizId}`;
  if (quiz.length === 0) return notFound();

  return (
    <main className="wrapper">
      <PageIntro
        heading={quiz[0].title}
        description={quiz[0].description}
        image="image"
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

export default QuizParticipants;
