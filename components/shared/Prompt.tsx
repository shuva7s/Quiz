"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Loader2, WandSparkles } from "lucide-react";

type PromptDialogProps = {
  onSubmit: (prompt: string) => void;
  loading?: boolean;
  generating?: boolean;
};

const Prompt = ({ onSubmit, loading, generating }: PromptDialogProps) => {
  const [prompt, setPrompt] = useState("");
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!prompt.trim()) {
      setError("Prompt cannot be empty");
      return;
    }

    onSubmit(prompt.trim());
    setPrompt("");
    setError("");
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          type="button"
          disabled={loading || generating}
        >
          {generating ? (
            <Loader2 className="animate-spin" />
          ) : (
            <>
              <WandSparkles />
              Generate with AI
            </>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Generate Questions with AI</DialogTitle>
          <DialogDescription>
            Enter a custom prompt to generate quiz questions.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <Input
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value);
              if (e.target.value.trim()) setError("");
            }}
            placeholder="e.g. 3 quiz questions about HTML"
            onKeyDown={handleKeyDown}
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>

          <Button
            type="button"
            onClick={handleSubmit}
            disabled={loading || generating}
          >
            {generating ? <Loader2 className="animate-spin" /> : "Generate"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Prompt;
