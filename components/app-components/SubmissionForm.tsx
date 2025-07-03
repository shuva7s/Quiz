"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CheckCircle, Loader2, Send } from "lucide-react";
import { Question } from "@/app/(root)/quiz/[id]/page";
import { useState, useEffect } from "react";
import { Progress } from "../ui/progress";
import { submission, SubmissionType } from "@/lib/actions/quiz.actions";
import { toast } from "sonner";

const generateSchema = (questions: Question[]) =>
  z.object({
    answers: z.object(
      Object.fromEntries(
        questions.map((q) => [q.id, z.string().min(1, "Select an option")])
      )
    ),
  });

const SubmissionForm = ({ data, qid }: { data: Question[]; qid: string }) => {
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  const formSchema = generateSchema(data);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      answers: {},
    },
  });

  const watchedAnswers = form.watch("answers");
  const answeredCount = Object.keys(watchedAnswers).filter(
    (key) => watchedAnswers[key]
  ).length;

  useEffect(() => {
    const newProgress = (answeredCount / data.length) * 100;
    setProgress(newProgress);
  }, [answeredCount, data.length]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 5000));

    try {
      const submissionData: SubmissionType = {
        answers: values.answers,
      };

      const result = await submission({
        qid,
        data: submissionData,
      });

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to submit quiz. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="sticky top-0 -mt-5">
        <div className="h-5 w-full bg-background" />
        <div className="p-5 bg-card/90 dark:bg-card/80 border border-primary/20 backdrop-blur-lg rounded-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 hidden dark:block" />
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-primary">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">
                {answeredCount} of {data.length} completed
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              {Math.round(progress)}% Complete
            </div>
          </div>
          <Progress value={progress} className="rounded-full" />
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {data.map((q, i: number) => {
            const isAnswered = watchedAnswers[q.id];

            return (
              <div
                key={q.id}
                className={`transition-all duration-200 rounded-md ${
                  isAnswered ? "bg-primary/10" : "bg-card"
                }`}
              >
                <div className="p-6">
                  <FormField
                    control={form.control}
                    name={`answers.${q.id}`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="mb-4 gap-4 items-start">
                          <div
                            className={`size-8 rounded-full fl_center leading-none shrink-0 ${
                              isAnswered ? "bg-primary" : "bg-muted"
                            }`}
                          >
                            {i + 1}
                          </div>
                          <h3 className="text-lg leading-relaxed">{q.question}</h3>
                        </FormLabel>

                        <div className="ml-8">
                          <FormControl>
                            <RadioGroup
                              disabled={loading}
                              onValueChange={field.onChange}
                              value={field.value}
                              className="space-y-1"
                            >
                              {q.options.map((opt, index) => {
                                const isSelected =
                                  field.value === index.toString();

                                return (
                                  <FormItem
                                    key={index}
                                    className={`
                                      ${
                                        isSelected
                                          ? "bg-primary/10 rounded-full"
                                          : ""
                                      }
                                    `}
                                  >
                                    <FormControl>
                                      <RadioGroupItem
                                        value={index.toString()}
                                        className="sr-only"
                                      />
                                    </FormControl>
                                    <FormLabel className="">
                                      <div className="flex items-center">
                                        <span
                                          className={`
                                          size-6 m-3 rounded-full text-xs fl_center
                                          ${
                                            isSelected
                                              ? "bg-primary"
                                              : "bg-foreground/20"
                                          }
                                        `}
                                        >
                                          {String.fromCharCode(65 + index)}
                                        </span>
                                        <span className="text-sm">{opt}</span>
                                      </div>
                                    </FormLabel>
                                  </FormItem>
                                );
                              })}
                            </RadioGroup>
                          </FormControl>
                          <FormMessage className="mt-2 bg-destructive/10 mr-8 p-3 rounded-md" />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            );
          })}
          <div className="mb-6">
            <Button
              type="submit"
              size="lg"
              className="relative w-full min-h-12"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  <Send className="size-4" />
                  Submit
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default SubmissionForm;
