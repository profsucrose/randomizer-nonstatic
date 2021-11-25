// hooks
import { useState, useCallback, useEffect } from "react";

// components
import { Modal, Box, Typography, Button } from "@mui/material";

// types
import { SxProps, Theme } from "@mui/system";

// styling
const ERROR_MODAL_STYLING: SxProps<Theme> = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "min(400px, 85vw)",
  boxSizing: "border-box",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "4px",
  // center text (for now)
  textAlign: "center",
};

export default function ErrorModal({
  title,
  error,
}: {
  title?: string;
  error?: Error | null;
}) {
  const [open, setOpen] = useState(false);

  const openModal = useCallback(() => setOpen(true), [setOpen]);
  const closeModal = useCallback(() => setOpen(false), [setOpen]);

  useEffect(() => {
    // open modal if error, close if not
    error ? openModal() : closeModal();
  }, [error, openModal, closeModal]);

  return (
    <Modal
      open={open}
      onClose={closeModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={ERROR_MODAL_STYLING}>
        <Typography
          id="modal-modal-title"
          variant="h5"
          component="h2"
          fontWeight="700"
        >
          {title || "Error"}
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          {error?.message}
        </Typography>
        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 3 }}
          onClick={closeModal}
        >
          Close
        </Button>
      </Box>
    </Modal>
  );
}
