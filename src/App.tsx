import { createContext, useMemo } from "react";

// router
import {
  Link as RouterLink,
  Routes,
  Route,
  Outlet,
  useLocation,
} from "react-router-dom";

// components
import {
  AppBar,
  Box,
  IconButton,
  Link,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";

// config
import navItems, { NavItemInterface } from "./config/navItems";

// hooks
import useResizeObserver from "./hooks/useResizeObserver";

// auth
import PrivateRoute from "./auth/PrivateRoute";
import { AuthProvider, useAuth } from "./auth/AuthProvider";

// pages
import RandomizerPage from "./pages/RandomizerPage";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route path="/" element={<RandomizerPage />} />
          <PrivateRoute path="admin" element={<AdminPlaceholder />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

function AdminPlaceholder() {
  const auth = useAuth();
  return <button onClick={auth.logOut}>Log Out</button>;
}

export const AppLayoutContext = createContext<{
  appBar: { width: number; height: number };
}>({ appBar: { width: 0, height: 0 } });

function AppLayout() {
  const appBarObserver = useResizeObserver();

  return (
    <AppLayoutContext.Provider
      value={{
        appBar: { width: appBarObserver.width, height: appBarObserver.height },
      }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="sticky" ref={appBarObserver.ref}>
          <Toolbar>
            <Typography
              variant="h6"
              sx={{ flexGrow: 1, color: "#fff", textDecoration: "none" }}
            >
              <Link
                component={RouterLink}
                to="/"
                color="#fff"
                sx={{ textDecoration: "none" }}
              >
                Jeff's Randomizer
              </Link>
            </Typography>
            {/* nav buttons */}
            {navItems.map((item, index) => (
              <NavButton
                navItem={item}
                // right margin for all except last one
                marginRight={index + 1 === navItems.length ? 0 : 2}
              />
            ))}
          </Toolbar>
        </AppBar>
        <Box style={{ minHeight: `calc(100vh - ${appBarObserver.height}px)` }}>
          <Outlet />
        </Box>
      </Box>
    </AppLayoutContext.Provider>
  );
}

function NavButton({
  navItem,
  marginRight,
}: {
  navItem: NavItemInterface;
  marginRight?: number | string;
}) {
  const { pathname } = useLocation();

  const isSelected = useMemo(
    () => pathname === navItem.href,
    [pathname, navItem.href]
  );

  return (
    <Box
      // optional right margin
      mr={marginRight}
    >
      <Tooltip title={navItem.name}>
        <IconButton
          size="large"
          edge="end"
          aria-label={navItem.name}
          component={RouterLink}
          to={navItem.href}
          sx={{
            // add transparent white bg when selected
            backgroundColor: isSelected
              ? "rgba(255, 255, 255, 0.35) !important"
              : null,
            color: "inherit",
          }}
          // disable ripple when selected
          disableRipple={isSelected}
          disableTouchRipple={isSelected}
          disableFocusRipple={isSelected}
        >
          {navItem.icon}
        </IconButton>
      </Tooltip>
    </Box>
  );
}
