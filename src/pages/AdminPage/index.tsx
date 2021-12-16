// components
import { Link as RouterLink, Outlet, useLocation } from "react-router-dom";
import { Box, Tab, Tabs } from "@mui/material";
import PaddedContainer from "../../components/PaddedContainer";

export default function AdminPage() {
  const { pathname } = useLocation();
  return (
    <PaddedContainer>
      <Tabs value={pathname} centered>
        {AdminPageLinks.map((link) => (
          <LinkTab {...link} value={link.to} key={link.to} />
        ))}
      </Tabs>
      <Box pt={1} sx={{ borderTop: 1, borderColor: "divider" }}>
        <Outlet />
      </Box>
    </PaddedContainer>
  );
}

function LinkTab({
  label,
  to,
  value,
}: {
  label: string;
  to: string;
  value: string;
}) {
  return <Tab label={label} component={RouterLink} value={value} to={to} />;
}

// fix link string
// e.g. "/"" -> ""; "edit" -> "/edit"; "/edit" -> "/edit"
const fixLinkTo = (to: string) =>
  to === "/" ? "" : to.charAt(0) !== "/" ? "/" + to : to;

const AdminPageLinks: { label: string; to: string }[] = [
  { label: "General", to: "/" },
  { label: "Lists", to: "lists" },
  { label: "About", to: "about" },
].map((link) => {
  // fix paths
  link.to = "/admin" + fixLinkTo(link.to);
  return link;
});
