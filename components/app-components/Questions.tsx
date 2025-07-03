import { Question } from "@/app/(root)/quiz/[id]/page";
import { neon } from "@neondatabase/serverless";
import SubmissionForm from "./SubmissionForm";
import { Progress } from "../ui/progress";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Questions = async ({ qid, uid }: { qid: string; uid: string }) => {
  const sql = neon(process.env.DATABASE_URL!);

  const attempts = await sql`
  SELECT *
  FROM attempt
  WHERE quiz_id = ${qid}
  AND user_id = ${uid};
  `;

  // console.log(attempts);

  if (attempts.length > 0)
    return (
      <section>
        <Card>
          <CardHeader>
            <CardTitle>Your score</CardTitle>
            <CardDescription>Your score for this quiz is</CardDescription>
            <CardAction className="p-2 font-semibold rounded-full text-sm px-3 bg-primary text-white">
              {attempts[0].score}%
            </CardAction>
          </CardHeader>
          <CardContent>
            <Progress value={attempts[0].score || 0} />
          </CardContent>
        </Card>
      </section>
    );

  const questions = (await sql`
  SELECT id, quiz_id, question, options
  FROM question
  WHERE quiz_id = ${qid};
`) as Question[];
  return (
    <section>
      <SubmissionForm data={questions} qid={qid} />
    </section>
  );
};

export default Questions;
