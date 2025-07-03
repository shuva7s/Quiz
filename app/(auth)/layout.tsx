export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen p-5 fl_center gap-4 flex-col mb-0 relative bg-card dark:bg-card/60">
      <h1 className="text-6xl font-semibold text-center leading-15 z-10">
        Explore
        <br /> the world of
        <br /> <span className="text-primary">quizzes</span>
      </h1>
      <p className="text-center text-muted-foreground text-lg z-10">
        Ready to test your knowledge? <br />
        Play, learn, and conquer!
      </p>
      <div className="absolute size-40 rounded-full bg-primary blur-[10rem] hidden dark:block" />
      <div className="w-full max-w-lg border border-foreground/15 border-dashed relative my-1.5">
        <div className="absolute min-h-72 border border-foreground/15 border-dashed bottom-0 left-0 translate-y-1/3" />
        <div className="absolute min-h-72 border border-foreground/15 border-dashed top-0 right-0 -translate-y-1/3" />
        <div className="absolute size-5 rounded-full border border-primary border-dashed left-0 top-1/2 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute size-7 rounded-full border border-primary border-dashed right-0 top-1/2 translate-x-1/2 -translate-y-1/2" />
      </div>
      {children}
    </main>
  );
}
