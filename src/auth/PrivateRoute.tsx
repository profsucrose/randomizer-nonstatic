import React, { useContext, useEffect, useMemo } from "react";
import { Route } from "react-router-dom";

// context
import { AuthContext } from "./AuthProvider";

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
  const auth = useContext(AuthContext);

  useEffect(() => {
    console.log("priv");
  }, []);

  // if authed, show route content
  // if not, show login page
  const routeComponent = useMemo(
    () => (auth.hasAuth ? element : <div>Login!</div>),
    [auth.hasAuth, element]
  );

  return (
    <Route path={path} element={routeComponent}>
      {children}
    </Route>
  );
}
