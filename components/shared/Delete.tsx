"use client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Loader2, Trash } from "lucide-react";
import { useState } from "react";
import { delete_quiz } from "@/lib/actions/quiz.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const Delete = ({ qid }: { qid: string }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="w-full min-h-16"
          variant={"destructive"}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <>
              <Trash />
              Delete quiz
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription className="leading-relaxed">
            This action cannot be undone. This will permanently delete this quiz
            and remove all results associated with it.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              disabled={loading}
              onClick={async () => {
                setLoading(true);
                try {
                  const { success, message } = await delete_quiz(qid);
                  if (success) {
                    toast.success(message);
                    router.replace("/");
                  } else {
                    toast.error(message);
                  }
                } catch (error) {
                  toast.error(
                    (error as Error).message || "Something went wrong"
                  );
                }
              }}
              variant={"destructive"}
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  <Trash />
                  Delete quiz
                </>
              )}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Delete;
