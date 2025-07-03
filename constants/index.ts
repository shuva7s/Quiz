import { Home, List, Plus, Settings, User } from "lucide-react";

const navlinks = [
  {
    name: "Home",
    href: "/",
    icon: Home,
  },
  // {
  //   name: "Join",
  //   href: "/join",
  //   icon: Plus,
  // },
  {
    name: "History",
    href: "/history",
    icon: List,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
  {
    name: "Profile",
    href: "/profile",
    icon: User,
  },
];

export { navlinks };
