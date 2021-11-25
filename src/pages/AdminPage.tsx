import { useContext } from "react";

// context
import { AppLayoutContext } from "../App";

// hooks
import { useAuth } from "../auth/AuthProvider";

// firebase
import { getFirestore, doc } from "@firebase/firestore";
import firebaseApp from "../auth/base";
import { useDocument } from "react-firebase-hooks/firestore";

// components
import { Button } from "@mui/material";

export default function AdminPage() {
  const { currentUser } = useAuth();
  const { snackbar } = useContext(AppLayoutContext);

  const [value, loading, error] = useDocument(
    doc(getFirestore(firebaseApp), "config", "adminList"),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  return (
    <div>
      <p style={{ fontWeight: 700 }}>
        Hello, {currentUser?.displayName} ({currentUser?.email})
      </p>
      <p>
        {error
          ? "Error: " + error.message
          : loading
          ? "Loading..."
          : JSON.stringify(value?.data())}
      </p>
      <Button
        variant="contained"
        onClick={() => snackbar.showMessage("Random number: " + Math.random())}
      >
        Snackbar Demo
      </Button>
    </div>
  );
}
