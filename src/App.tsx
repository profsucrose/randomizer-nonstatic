import { createContext, useCallback, useMemo, useState } from "react";

// router
import {
  Link as RouterLink,
  Routes,
  Route,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

// components
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Link,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import ErrorModal from "./components/ErrorModal";

// config
import navItems, { NavItemInterface } from "./config/navItems";

// hooks
import useResizeObserver from "./hooks/useResizeObserver";

// auth
import PrivateRoute from "./auth/PrivateRoute";
import { AuthProvider, useAuth } from "./auth/AuthProvider";

// pages
import RandomizerPage from "./pages/RandomizerPage";
import AdminPage from "./pages/AdminPage";
import GlobalSnackbar from "./components/GlobalSnackbar";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route path="/" element={<RandomizerPage />} />
          <PrivateRoute path="admin" element={<AdminPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export const AppLayoutContext = createContext<{
  appBar: { width: number; height: number };
  snackbar: {
    showMessage: (message: string) => void;
    isVisible: boolean;
    setVisibility: React.Dispatch<React.SetStateAction<boolean>>;
  };
}>({
  appBar: { width: 0, height: 0 },
  snackbar: {
    showMessage: () => {},
    isVisible: false,
    setVisibility: () => {},
  },
});

function AppLayout() {
  const navigate = useNavigate();
  const appBarObserver = useResizeObserver();
  const { hasAuth, logOut } = useAuth();

  // error for ErrorModal
  const [error, setError] = useState<Error | null>(null);

  // snackbar setup
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [snackbarIsVisible, setSnackbarVisibility] = useState<boolean>(false);

  const showSnackbarMessage = useCallback(
    (message) => {
      setSnackbarMessage(message);
      // show snackbar if message, hide if null
      setSnackbarVisibility(message !== null);
    },
    [setSnackbarMessage, setSnackbarVisibility]
  );

  const handleLogOut = useCallback(() => {
    logOut()
      .then(() => {
        navigate("/"); // go to main page
        showSnackbarMessage("Signed out");
      })
      .catch((e) => setError(e));
  }, [logOut, navigate, showSnackbarMessage, setError]);

  return (
    <AppLayoutContext.Provider
      value={{
        appBar: { width: appBarObserver.width, height: appBarObserver.height },
        snackbar: {
          showMessage: showSnackbarMessage,
          isVisible: snackbarIsVisible,
          setVisibility: setSnackbarVisibility,
        },
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
            {hasAuth ? (
              <Button color="inherit" sx={{ ml: 3 }} onClick={handleLogOut}>
                Sign Out
              </Button>
            ) : null}
          </Toolbar>
        </AppBar>
        <Box style={{ minHeight: `calc(100vh - ${appBarObserver.height}px)` }}>
          <Outlet />
        </Box>
      </Box>
      {/* error modal for any issues w/ logout (for now) */}
      <ErrorModal error={error} />
      {/* snackbar/toast for messages */}
      <GlobalSnackbar message={snackbarMessage} />
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
