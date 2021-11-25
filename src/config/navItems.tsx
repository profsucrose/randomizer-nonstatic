import { AdminPanelSettings, Shuffle } from "@mui/icons-material";

export interface NavItemInterface {
  name: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItemInterface[] = [
  {
    name: "Randomizer",
    href: "/",
    icon: <Shuffle />,
  },
  {
    name: "Admin",
    href: "/admin",
    icon: <AdminPanelSettings />,
  },
];

export default navItems;
