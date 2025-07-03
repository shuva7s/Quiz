import PageIntro from "@/components/shared/PageIntro";
import QuizForm from "@/components/shared/QuizForm";

const CreateQuiz = () => {
  return (
    <main className="wrapper">
      <PageIntro
        heading="Create quiz"
        description="Create a new quiz and share it with others"
      />
      <section>
        <QuizForm type="create" />
      </section>
    </main>
  );
};

export default CreateQuiz;
