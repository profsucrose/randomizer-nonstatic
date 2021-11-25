// components
import { Box } from "@mui/material";

// context
import { AppLayoutContext } from "../App";

// hooks
import { useContext } from "react";

// types
import { BoxProps } from "@mui/system";

export default function PaddedContainer({ children, ...props }: BoxProps) {
  const appLayout = useContext(AppLayoutContext);

  return (
    <Box
      boxSizing="border-box"
      p={2}
      // give min height to container if we are in an AppLayout
      sx={{
        minHeight: appLayout
          ? `calc(100vh - ${appLayout.appBar.height}px)`
          : null,
      }}
      {...props}
    >
      {children}
    </Box>
  );
}
