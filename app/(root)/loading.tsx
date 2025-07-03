import { Loader2 } from "lucide-react";

const Loader = () => {
  return (
    <main className="wrapper min-h-[50vh] fl_center">
      <Loader2 className="size-6 animate-spin text-muted-foreground" />
    </main>
  );
};

export default Loader;
