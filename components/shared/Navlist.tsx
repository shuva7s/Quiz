"use client";

import { navlinks } from "@/constants";
import Link from "next/link";
import { SheetClose } from "../ui/sheet";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";

const Navlist = ({ mode }: { mode: "mobile" | "desktop" }) => {
  const pathName = usePathname();
  return (
    <div
      className={`flex flex-col gap-2 px-5 ${
        mode === "desktop" ? "flex-1" : "py-1"
      }`}
    >
      {mode === "mobile" && (
        <>
          {navlinks.map((link) => (
            <SheetClose key={link.href} asChild>
              <Button
                size={"lg"}
                variant={"ghost"}
                asChild
                className={`w-full justify-start p-0 h-auto text-foreground ${
                  pathName === link.href &&
                  "bg-primary gap-0 text-white hover:bg-primary hover:text-white dark:hover:bg-primary"
                }`}
              >
                <Link href={link.href}>
                  <div
                    className={`size-12 transition-colors flex justify-center items-center rounded-lg ${
                      pathName !== link.href && "bg-accent/50"
                    }`}
                  >
                    <link.icon className="size-4.5" />
                  </div>
                  {link.name}
                </Link>
              </Button>
            </SheetClose>
          ))}
        </>
      )}
      {mode === "desktop" && (
        <>
          {navlinks.map((link) => (
            <Button
              size={"lg"}
              variant={"ghost"}
              className={`w-full justify-start p-0 h-auto text-foreground ${
                pathName === link.href &&
                "bg-primary gap-0 text-white hover:bg-primary hover:text-white dark:hover:bg-primary"
              }`}
              asChild
              key={link.href}
            >
              <Link href={link.href}>
                <div
                  className={`size-12 flex justify-center transition-colors items-center rounded-lg ${
                    pathName !== link.href && "bg-accent/50"
                  }`}
                >
                  <link.icon className="size-4.5" />
                </div>
                {link.name}
              </Link>
            </Button>
          ))}
        </>
      )}
    </div>
  );
};

export default Navlist;
