"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import Link from "next/link";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const SignInSignUp = ({ login }: { login?: boolean }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  async function handleSignIn() {
    setLoading(true);
    await authClient.signIn.social(
      {
        provider: "github",
      },
      {
        onSuccess: () => {
          router.push("/");
        },
        onError: (ctx) => {
          setError(ctx.error.message);
          setLoading(false);
        },
      }
    );
  }

  return (
    <Card className="w-full max-w-sm bg-transparent border-none gap-2 p-0 shadow-none">
      <CardHeader>
        <CardTitle className="text-center">
          {login ? "Sign in to continue" : "Create an account"}
        </CardTitle>
        <CardDescription className="sr-only">Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="text-destructive bg-destructive/10 p-4 mb-4 rounded-sm text-sm">
            {error}
          </div>
        )}
        <Button
          disabled={loading}
          className="w-full"
          size={"lg"}
          onClick={() => handleSignIn()}
        >
          {loading ? (
            <Loader2 className="animate-spin" />
          ) : (
            "Continue with Github"
          )}
        </Button>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-xs text-muted-foreground">
          {login ? "Don't have an account?" : "Already have an account?"}
        </p>
        <Button disabled={loading} variant="link" size="xs" asChild>
          <Link href={login ? "/sign-up" : "/sign-in"}>
            {login ? "Sign up" : "Sign in"}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SignInSignUp;
