import { useContext } from "react";

// context
import { AppLayoutContext } from "../App";

// components
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Link,
  Typography,
} from "@mui/material";

// icons
import { GitHub as GitHubIcon } from "@mui/icons-material";

// config
import { version as appVersion } from "../../package.json";
import { REPOSITORY_URL } from "../config";

export default function AdminPage() {
  const { appBar } = useContext(AppLayoutContext);

  return (
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
            href={REPOSITORY_URL + "/tree/master/lists"}
            target="_blank"
            rel="noopener noreferrer"
            fullWidth
          >
            Edit Lists on GitHub
          </Button>
        </CardContent>
        <Divider />
        <CardContent>
          <Typography variant="body1" fontWeight="500" gutterBottom>
            Randomizer v{appVersion} (
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href={REPOSITORY_URL + "/commit/" + __COMMIT_HASH__}
              fontFamily="'Roboto Mono', monospace"
            >
              {__COMMIT_HASH__.substring(0, 7)}
            </Link>
            )
          </Typography>
          <Typography variant="body1">
            Created for Jeff Miller by Zane St. John
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
