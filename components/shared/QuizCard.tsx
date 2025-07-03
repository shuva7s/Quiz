import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ImageIcon } from "lucide-react";
import Link from "next/link";

const QuizCard = ({
  id,
  title,
  description,
  score = "",
}: {
  id: string;
  title: string;
  description?: string;
  score?: string;
}) => {
  return (
    <Card className="relative p-0 overflow-hidden bg-transparent">
      <Link href={`/quiz/${id}`}>
        <div className="min-h-72 bg-card fl_center mask-b-from-75%">
          <ImageIcon className="size-8 text-muted-foreground" />
        </div>
        <CardHeader className="absolute w-full bottom-0 py-5">
          <CardTitle className="line-clamp-1">{title}</CardTitle>
          <CardDescription className={description ? "line-clamp-1" : "sr-only"}>
            {description ? description : "Card Description"}
          </CardDescription>
        </CardHeader>
        {score && (
          <div className="absolute text-white top-5 bg-primary px-3 py-2 rounded-full text-sm font-semibold right-5">
            {score}%
          </div>
        )}
      </Link>
    </Card>
  );
};

export default QuizCard;
