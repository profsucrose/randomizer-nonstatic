// firebase
import { useCollectionData } from "react-firebase-hooks/firestore";
import { listsCollection } from "../utils/db";

// types
import { RandomizerInfo } from "../interfaces/randomizer";

export default function useLists() {
  const [data, loading, error] = useCollectionData(listsCollection, {
    snapshotListenOptions: { includeMetadataChanges: true },
    idField: "id",
  });

  return {
    data: data as unknown as RandomizerInfo[] | undefined,
    loading,
    error,
  };
}
