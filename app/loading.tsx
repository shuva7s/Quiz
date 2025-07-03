import { Loader2 } from "lucide-react";
const loader = () => {
  return (
    <main className="min-h-[80vh] fl_center">
      <Loader2 className="size-6 animate-spin text-muted-foreground" />
    </main>
  );
};

export default loader;
