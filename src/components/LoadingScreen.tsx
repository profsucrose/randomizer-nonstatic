import { useContext, memo } from "react";

// context
import { AppLayoutContext } from "../App";

// components
import { Box, Typography, CircularProgress } from "@mui/material";

const LoadingScreen = memo(function LoadingScreen() {
  const { appBar } = useContext(AppLayoutContext);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{ height: `calc(100vh - ${appBar.height}px)` }}
    >
      <Box>
        <Box
          sx={{
            position: "relative",
            left: "50%",
            transform: "translateX(-50%)",
            display: "inline-block",
          }}
        >
          <CircularProgress size="80px" thickness={2} aria-label="Loading..." />
        </Box>
        <Typography
          fontSize="20px"
          textAlign="center"
          mt={3}
          sx={{ userSelect: "none" }}
        >
          Loading&hellip;
        </Typography>
      </Box>
    </Box>
  );
});

export default LoadingScreen;
