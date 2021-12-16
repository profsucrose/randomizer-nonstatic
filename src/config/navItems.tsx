import { AdminPanelSettings, Shuffle } from "@mui/icons-material";

export interface NavItemInterface {
  name: string;
  icon: React.ReactNode;
  href: string;
  match?: string[]; // optionally, path patterns to match
}

const navItems: NavItemInterface[] = [
  {
    name: "Randomizer",
    icon: <Shuffle />,
    href: "/",
  },
  {
    name: "Admin",
    icon: <AdminPanelSettings />,
    href: "/admin",
    match: ["/admin", "/admin/*"],
  },
];

export default navItems;
