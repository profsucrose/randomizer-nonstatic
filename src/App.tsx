// components
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import AccountCircle from "@mui/icons-material/AccountCircle";

// router
import { Link, Routes, Route, Outlet } from "react-router-dom";
import PrivateRoute from "./auth/PrivateRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route path="/" element={<span>Hi!</span>} />
      </Route>
      <PrivateRoute path="/admin" element={<span>Admin</span>} />
    </Routes>
  );
}

function AppLayout() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            sx={{ flexGrow: 1, color: "#fff", textDecoration: "none" }}
            component={Link}
            to="/"
          >
            Jeff's Randomizer
          </Typography>
          <Tooltip title="Admin Login">
            <IconButton
              size="large"
              edge="end"
              aria-label="Admin Login"
              color="inherit"
              component={Link}
              to="/admin"
            >
              <AccountCircle />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      <Box p={2}>
        <Outlet />
      </Box>
    </Box>
  );
}
