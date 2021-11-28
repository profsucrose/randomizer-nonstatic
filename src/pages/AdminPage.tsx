import { useContext } from "react";

// context
import { AppLayoutContext } from "../App";

// config
import { version as appVersion } from "../../package.json";

// hooks
import { useAuth } from "../auth/AuthProvider";

// firebase
import { getFirestore, doc } from "@firebase/firestore";
import firebaseApp from "../auth/base";
import { useDocument } from "react-firebase-hooks/firestore";

// components
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import PaddedContainer from "../components/PaddedContainer";

export default function AdminPage() {
  const { currentUser } = useAuth();
  const { showSnackbarMessage } = useContext(AppLayoutContext);

  const [adminList, loading, error] = useDocument(
    doc(getFirestore(firebaseApp), "config", "adminList"),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  return (
    <PaddedContainer>
      <Typography component="h1" variant="h4" gutterBottom>
        Admin
      </Typography>
      <Typography variant="body1" fontWeight="700">
        Art Randomizer v{appVersion}
      </Typography>
      <Typography variant="body1" fontWeight="700" gutterBottom>
        Hello, {currentUser?.displayName} ({currentUser?.email})
      </Typography>
      {error ? (
        <Typography gutterBottom>"Error: " + error.message</Typography>
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
              <Typography key={admin} component="li">
                {admin}
              </Typography>
            ))}
          </Box>
        </>
      )}
      <Button
        variant="contained"
        onClick={() => showSnackbarMessage("Random number: " + Math.random())}
      >
        Snackbar Demo
      </Button>
    </PaddedContainer>
  );
}
