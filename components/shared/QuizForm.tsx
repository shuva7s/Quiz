"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, Plus, Trash2, WandSparkles } from "lucide-react";
import {
  create_quiz,
  generateQuizQuestionsFromPrompt,
  update_quiz,
} from "@/lib/actions/quiz.actions";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Prompt from "./Prompt";

export const optionSchema = z.string().min(1, "Option cannot be empty");

export const questionSchema = z.object({
  id: z.string(),
  question: z.string().min(1, "Question is required"),
  options: z.array(optionSchema).min(2, "At least 2 options required"),
  answer: z.number().min(0, "Select a correct answer"),
});

export const formSchema = z.object({
  name: z
    .string()
    .min(2, "Quiz name is required")
    .max(100, "Name must be less than 100 characters"),
  description: z
    .string()
    .min(2, "Description is required")
    .max(300, "Description must be less than 300 characters"),
  questions: z.array(questionSchema).min(1),
});

export type CreateQuestionType = {
  question: string;
  options: string[];
  answer: number;
};

export type UpdateQuestionType = {
  id: string;
  question: string;
  options: string[];
  answer: number;
};

type QuizFormProps =
  | {
      type: "create";
      qid?: string;
      quiz_name?: string;
      quiz_description?: string;
      questions?: CreateQuestionType[];
    }
  | {
      type: "update";
      qid: string;
      quiz_name: string;
      quiz_description: string;
      questions: UpdateQuestionType[];
    };

const QuizForm = ({
  type = "create",
  qid,
  quiz_name,
  quiz_description,
  questions,
}: QuizFormProps) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [generating, setGenerating] = useState(false);

  const isUpdate = type === "update";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: isUpdate ? quiz_name : "",
      description: isUpdate ? quiz_description : "",
      questions: isUpdate
        ? questions
        : [
            {
              id: "",
              question: "",
              options: ["", ""],
              answer: 0,
            },
          ],
    },
  });

  const {
    fields: questionFields,
    append: appendQuestion,
    remove: removeQuestion,
  } = useFieldArray({
    control: form.control,
    name: "questions",
  });

  const addQuestion = () => {
    appendQuestion({
      id: "",
      question: "",
      options: ["", ""],
      answer: 0,
    });
  };

  const addOption = (questionIndex: number) => {
    const currentOptions = form.getValues(`questions.${questionIndex}.options`);
    form.setValue(`questions.${questionIndex}.options`, [
      ...currentOptions,
      "",
    ]);
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const currentOptions = form.getValues(`questions.${questionIndex}.options`);
    if (currentOptions.length > 2) {
      const updatedOptions = currentOptions.filter(
        (_, index) => index !== optionIndex
      );
      form.setValue(`questions.${questionIndex}.options`, updatedOptions);

      // Adjust correct answer index if necessary
      const currentCorrectIndex = form.getValues(
        `questions.${questionIndex}.answer`
      );
      if (currentCorrectIndex >= optionIndex && currentCorrectIndex > 0) {
        form.setValue(
          `questions.${questionIndex}.answer`,
          currentCorrectIndex - 1
        );
      }
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!isUpdate) {
      try {
        setLoading(true);
        const { success, message, quizId } = await create_quiz({
          data: values,
        });

        if (success) {
          form.reset();
          toast.success(message);
          router.replace(`/quiz/${quizId}`);
        } else toast.error(message);
      } catch (error) {
        toast.error((error as Error).message || "Something went wrong");
      } finally {
        // setLoading(false);
      }
    } else {
      try {
        setLoading(true);

        const { success, message } = await update_quiz({
          qid: qid!,
          data: values,
        });

        if (success) {
          form.reset();
          toast.success(message);
          router.push(`/quiz/${qid}`);
        } else toast.error(message);
      } catch (error) {
        toast.error((error as Error).message || "Something went wrong");
      } finally {
        // setLoading(false);
      }
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="p-5 bg-card space-y-4 rounded-md">
          <h2 className="h4 text-primary">Basic information</h2>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quiz name</FormLabel>
                <FormControl>
                  <Input
                    disabled={loading || generating}
                    placeholder="Enter quiz name"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quiz description</FormLabel>
                <FormControl>
                  <Input
                    disabled={loading || generating}
                    placeholder="Enter quiz description"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="p-5 bg-card space-y-4 rounded-md">
          <div className="flex justify-between items-center gap-4 flex-wrap">
            <h2 className="h4 text-primary">Questions</h2>
            {/* <Button
              disabled={loading || generating}
              type="button"
              variant={"secondary"}
              onClick={async () => {
                const { name, description } = form.getValues();

                if (!name || !description) {
                  toast.error(
                    "Name and description are required to generate questions"
                  );
                  return;
                }

                try {
                  setGenerating(true);
                  const generatedQuestions = await generateQuizQuestions({
                    title: name,
                    description,
                  });
                  const existingQuestions = form.getValues("questions");

                  const isDefaultEmptyQuestion =
                    existingQuestions.length === 1 &&
                    !existingQuestions[0].question &&
                    existingQuestions[0].options.every((opt) => !opt);

                  if (isDefaultEmptyQuestion) {
                    form.setValue("questions", generatedQuestions);
                  } else {
                    form.setValue("questions", [
                      ...existingQuestions,
                      ...generatedQuestions,
                    ]);
                  }
                  toast.success("Questions generated successfully!");
                } catch (err) {
                  toast.error((err as Error).message);
                } finally {
                  setGenerating(false);
                }
              }}
            >
              {generating ? (
                "Generating..."
              ) : (
                <>
                  <WandSparkles /> Generate with AI
                </>
              )}
            </Button> */}

            <Prompt
              loading={loading}
              generating={generating}
              onSubmit={async (prompt) => {
                try {
                  setGenerating(true);
                  const generatedQuestions =
                    await generateQuizQuestionsFromPrompt(prompt);

                  const existingQuestions = form.getValues("questions");
                  const isDefaultEmpty =
                    existingQuestions.length === 1 &&
                    !existingQuestions[0].question &&
                    existingQuestions[0].options.every((opt) => !opt);

                  const updatedQuestions = isDefaultEmpty
                    ? generatedQuestions
                    : [...existingQuestions, ...generatedQuestions];

                  form.setValue("questions", updatedQuestions);
                  toast.success("Questions generated successfully!");
                } catch (err) {
                  toast.error((err as Error).message || "Failed to generate");
                } finally {
                  setGenerating(false);
                }
              }}
            />
          </div>

          {generating ? (
            <div className="p-5 fl_center gap-2 text-muted-foreground animate-pulse">
              <WandSparkles className="size-4" /> Generating...
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                {questionFields.map((field, questionIndex) => (
                  <div
                    key={field.id}
                    className="shadow-sm border rounded-sm p-4 space-y-4 bg-card"
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium">
                        Question {questionIndex + 1}
                      </h3>
                      {questionFields.length > 1 && (
                        <Button
                          disabled={loading}
                          type="button"
                          variant="destructive"
                          onClick={() => removeQuestion(questionIndex)}
                        >
                          <Trash2 />
                        </Button>
                      )}
                    </div>

                    <FormField
                      control={form.control}
                      name={`questions.${questionIndex}.question`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Question</FormLabel>
                          <FormControl>
                            <Input
                              disabled={loading}
                              placeholder="Enter your question"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-4">
                      <FormLabel>Options</FormLabel>

                      <FormField
                        control={form.control}
                        name={`questions.${questionIndex}.answer`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <RadioGroup
                                onValueChange={(value) =>
                                  field.onChange(parseInt(value))
                                }
                                value={field.value?.toString()}
                              >
                                {form
                                  .watch(`questions.${questionIndex}.options`)
                                  .map((_, optionIndex) => (
                                    <div
                                      key={optionIndex}
                                      className="flex items-center space-x-3"
                                    >
                                      <RadioGroupItem
                                        value={optionIndex.toString()}
                                        id={`q${questionIndex}_option${optionIndex}`}
                                      />
                                      <FormField
                                        control={form.control}
                                        name={`questions.${questionIndex}.options.${optionIndex}`}
                                        render={({ field: optionField }) => (
                                          <FormItem className="flex-1">
                                            <FormControl>
                                              <Input
                                                disabled={loading}
                                                placeholder={`Option ${
                                                  optionIndex + 1
                                                }`}
                                                {...optionField}
                                              />
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                      {form.watch(
                                        `questions.${questionIndex}.options`
                                      ).length > 2 && (
                                        <Button
                                          disabled={loading}
                                          type="button"
                                          variant="destructive"
                                          size="icon"
                                          onClick={() =>
                                            removeOption(
                                              questionIndex,
                                              optionIndex
                                            )
                                          }
                                        >
                                          <Trash2 />
                                        </Button>
                                      )}
                                    </div>
                                  ))}
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-end">
                        <Button
                          disabled={loading}
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => addOption(questionIndex)}
                        >
                          <Plus className="h-4 w-4" />
                          Add Option
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                disabled={loading}
                type="button"
                variant="secondary"
                onClick={addQuestion}
                className="w-full rounded-sm min-h-12 text-primary border border-primary/20 bg-primary/10 hover:border-primary/30 hover:bg-primary/20"
              >
                <Plus className="size-5" />
                Add Question
              </Button>
            </>
          )}
        </div>
        <Button
          size={"lg"}
          className="w-full min-h-12"
          type="submit"
          disabled={
            loading || generating || (isUpdate && !form.formState.isDirty)
          }
        >
          {loading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <span>{isUpdate ? "Update Quiz" : "Create Quiz"}</span>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default QuizForm;
