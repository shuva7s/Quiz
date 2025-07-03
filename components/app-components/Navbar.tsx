import { Menu } from "lucide-react";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Navlist from "../shared/Navlist";

const Navbar = () => {
  return (
    <nav className="wrapper py-4 flex items-center justify-between border-b lg:hidden">
      <p className="text-primary text-2xl font-bold">Quiz</p>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent side="right">
          <SheetHeader className="border-b">
            <SheetTitle className="text-primary">Quiz</SheetTitle>
            <SheetDescription className="sr-only">
              Some description
            </SheetDescription>
          </SheetHeader>
          <Navlist mode="mobile" />
        </SheetContent>
      </Sheet>
    </nav>
  );
};

export default Navbar;
