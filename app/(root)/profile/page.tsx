import PageIntro from "@/components/shared/PageIntro";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { auth } from "@/lib/auth";
import { Loader2 } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

async function Renderer() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return redirect("/sign-in");
  return (
    <section className="flex flex-col gap-4 justify-center items-center min-h-[65vh] bg-card rounded-md">
      <Avatar className="size-[24%] sm:size-28 md:size-32">
        <AvatarImage
          src={session.user.image || "https://github.com/shadcn.png"}
        />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div className="flex flex-col items-center">
        <h2 className="h5 line-clamp-1">{session.user.name}</h2>
        <p className="text-muted-foreground line-clamp-1">
          {session.user.email}
        </p>
        {(session.user.role === "admin" ||
          session.user.role === "superadmin") && (
          <p className="h-8 mt-1 fl_center px-3 rounded-full bg-primary text-white w-fit text-sm font-semibold">
            {session.user.role[0].toUpperCase() + session.user.role.slice(1)}
          </p>
        )}
      </div>
    </section>
  );
}

const ProfilePage = () => {
  return (
    <main className="wrapper">
      <PageIntro heading="Profile" description="Your profile page" />
      <Suspense
        fallback={
          <div className="p-5 min-h-42 fl_center">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        }
      >
        <Renderer />
      </Suspense>
    </main>
  );
};

export default ProfilePage;
