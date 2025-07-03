import Back from "@/components/shared/Back";
export default function NotFound() {
  return (
    <main className="min-h-screen fl_center flex-col my-0 wrapper">
      <p className="text-9xl font-bold leading-28 text-primary/50">404</p>
      <h1 className="h2">Page not found</h1>
      <Back className="mt-4" />
    </main>
  );
}
