import { useContext } from "react";

// context
import { AppLayoutContext } from "../../App";

// components
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  Link,
  Typography,
} from "@mui/material";

// icons
import { GitHub as GitHubIcon } from "@mui/icons-material";

export default function AdminPage() {
  const { appBar } = useContext(AppLayoutContext);

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
              Admin
            </Typography>
            <Typography gutterBottom paddingBottom="10px">
              Are you a student?{" "}
              <Link component={RouterLink} to="/">
                Go Back
              </Link>
            </Typography>
            <Button
              startIcon={<GitHubIcon />}
              variant="contained"
              href="https://github.com/zane-programs/randomizer-static/tree/master/public/lists"
              target="_blank"
              rel="noopener noreferrer"
              fullWidth
            >
              Update Lists on GitHub
            </Button>
          </CardContent>
        </Card>
      </Box>
    </>
  );
}
