"use client";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const Back = ({ className }: { className?: string }) => {
  const router = useRouter();
  return (
    <Button
      className={cn(className)}
      onClick={() => {
        router.back();
      }}
    >
      Go back
    </Button>
  );
};

export default Back;
