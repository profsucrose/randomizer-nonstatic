import { useCallback } from "react";

// hooks
import { useAuth } from "../../auth/AuthProvider";

// firebase
import { adminListDoc } from "../../utils/db";
import { useDocument } from "react-firebase-hooks/firestore";

// components
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { addAdmin, removeAdmin } from "../../utils/db";

export default function AdminGeneral() {
  const { currentUser } = useAuth();

  const [adminList, loading, error] = useDocument(adminListDoc, {
    snapshotListenOptions: { includeMetadataChanges: true },
  });

  const handleAddAdmin = useCallback(async () => {
    const adminEmail = window.prompt("Enter a Windward email below:");

    // add email to admin list
    if (adminEmail && adminEmail !== "") {
      addAdmin(adminEmail);
    }
  }, []);

  return (
    <>
      <Typography variant="body1" fontWeight="700" gutterBottom>
        Hello, {currentUser?.displayName} ({currentUser?.email})
      </Typography>
      {error ? (
        <Typography gutterBottom>{"Error: " + error.message}</Typography>
      ) : loading ? (
        <Box p={2} mb={2}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Typography component="h2" variant="h6" gutterBottom>
            Admins
          </Typography>
          <Box component="ul">
            {adminList?.data()?.admins.map((admin: string) => (
              <AdminItem key={admin} admin={admin} />
            ))}
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            aria-label="Add Admin"
            onClick={handleAddAdmin}
          >
            Admin
          </Button>
        </>
      )}
    </>
  );
}

function AdminItem({ admin }: { admin: string }) {
  const handleRemoveAdmin = useCallback(async () => {
    const shouldRemoveAdmin = window.confirm(`Remove admin ${admin}?`);

    // if shouldRemoveAdmin, set adminList doc, excluding now-removed email
    if (shouldRemoveAdmin) removeAdmin(admin);
  }, [admin]);

  return (
    <Typography component="li">
      {admin}
      <Box ml={1} display="inline-block">
        <Tooltip title="Remove Admin" placement="right">
          <IconButton
            color="error"
            aria-label={"Remove Admin " + admin}
            onClick={handleRemoveAdmin}
          >
            <Delete />
          </IconButton>
        </Tooltip>
      </Box>
    </Typography>
  );
}
