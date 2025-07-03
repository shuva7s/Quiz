import Signout from "@/components/auth-components/Signout";
import { ModeToggle } from "@/components/providers/mode-toggle";
import PageIntro from "@/components/shared/PageIntro";

const SettingsPage = () => {
  return (
    <main className="wrapper">
      <PageIntro heading="Settings" description="Customize your experience" />
      <section className="rounded-md bg-card">
        <div className="flex justify-between border-b p-5">
          <div>
            <h3 className="font-bold">Theme</h3>
            <p className="text-muted-foreground text-xs sm:text-sm">
              Choose the theme that suits you the most
            </p>
          </div>
          <ModeToggle />
        </div>

        <div className="flex justify-between p-5">
          <div>
            <h3 className="font-bold">Sign out</h3>
            <p className="text-muted-foreground text-xs sm:text-sm">
              Sign out of your account
            </p>
          </div>
          <Signout />
        </div>
      </section>
    </main>
  );
};

export default SettingsPage;
