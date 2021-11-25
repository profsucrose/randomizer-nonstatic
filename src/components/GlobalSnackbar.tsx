import { useCallback, useContext } from "react";

// components
import { Snackbar, IconButton } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

// context
import { AppLayoutContext } from "../App";

export default function GlobalSnackbar({
  message,
}: {
  message: string | null;
}) {
  const {
    snackbar: { setVisibility, isVisible },
  } = useContext(AppLayoutContext);

  const handleClose = useCallback(
    (_event: React.SyntheticEvent | React.MouseEvent, reason?: string) => {
      if (reason === "clickaway") {
        return;
      }

      setVisibility(false);
    },
    [setVisibility]
  );

  return (
    <Snackbar
      open={isVisible}
      autoHideDuration={5000}
      onClose={handleClose}
      message={message}
      action={
        <IconButton
          size="small"
          aria-label="close"
          color="inherit"
          onClick={handleClose}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      }
    />
  );
}
