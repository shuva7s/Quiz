"use client";
import { authClient } from "@/lib/auth-client";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, LogOut } from "lucide-react";

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

const Signout = ({ afterSignOut = "/sign-in" }: { afterSignOut?: string }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const handleSignOut = async () => {
    setLoading(true);
    await authClient.signOut();
    router.push(afterSignOut);
    router.refresh();
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="secondary"
          className="size-10"
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="animate-spin size-4 text-muted-foreground" />
          ) : (
            <LogOut />
          )}
          <span className="sr-only">Sign out button</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action will log you out of your account.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="secondary"
              onClick={handleSignOut}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="animate-spin size-4 text-muted-foreground" />
              ) : (
                "Sign out"
              )}
              <span className="sr-only">Sign out button</span>
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Signout;
