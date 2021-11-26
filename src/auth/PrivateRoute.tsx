import React, { useCallback, useMemo, useState, useContext } from "react";
import { Route } from "react-router-dom";

// hooks
import { useAuth } from "./AuthProvider";

// context
import { AppLayoutContext } from "../App";

// components
import { Card, CardContent, Box, Typography, Link } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import GoogleIcon from "@mui/icons-material/Google";
import { Link as RouterLink } from "react-router-dom";
import ErrorModal from "../components/ErrorModal";
import LoadingScreen from "../components/LoadingScreen";

interface PrivateRouteProps {
  path: string;
  element: React.ReactElement;
  children?: React.ReactNode;
}

export default function PrivateRoute({
  path,
  element,
  children,
}: PrivateRouteProps) {
  const { isLoaded, hasAuth } = useAuth();

  // if authed, show route content
  // if not, show login page
  const routeComponent = useMemo(
    () => (isLoaded ? hasAuth ? element : <Login /> : <LoadingScreen />),
    [isLoaded, hasAuth, element]
  );

  return (
    <Route path={path} element={routeComponent}>
      {children}
    </Route>
  );
}

function Login() {
  const { logIn } = useAuth();
  const [logInInProgress, setLogInInProgress] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<Error | null>(null);
  const { appBar } = useContext(AppLayoutContext);

  const handleLogIn = useCallback(() => {
    // start login
    setLogInInProgress(true);
    logIn().catch((e) => {
      // stop showing login
      setLogInInProgress(false);
      // show error
      setLoginError(e);
    });
  }, [logIn]);

  return (
    <>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        boxSizing="border-box"
        sx={{ height: `calc(100vh - ${appBar.height}px)` }}
      >
        <Card sx={{ width: "min(400px, 85vw)", textAlign: "center" }}>
          <CardContent>
            <Typography
              component="div"
              fontWeight="700"
              fontSize="25px"
              gutterBottom
            >
              Admin Login
            </Typography>
            <Typography gutterBottom paddingBottom="10px">
              Are you a student?{" "}
              <Link component={RouterLink} to="/">
                Go Back
              </Link>
            </Typography>
            <LoadingButton
              fullWidth
              disabled={logInInProgress}
              loading={logInInProgress}
              loadingPosition="start"
              startIcon={<GoogleIcon />}
              variant="contained"
              onClick={handleLogIn}
            >
              {logInInProgress ? "Signing In..." : "Sign In with Google"}
            </LoadingButton>
          </CardContent>
        </Card>
      </Box>
      <ErrorModal title="Login Error" error={loginError} />
    </>
  );
}
