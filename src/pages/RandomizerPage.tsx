import {
  useCallback,
  useRef,
  useState,
  createContext,
  useEffect,
  useContext,
} from "react";

// components
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import PaddedContainer from "../components/PaddedContainer";
import LoadingScreen from "../components/LoadingScreen";

// context
import { AppLayoutContext } from "../App";

// firebase
import { getFirestore, collection } from "@firebase/firestore";
import firebaseApp from "../auth/base";
import { useCollectionData } from "react-firebase-hooks/firestore";

interface RandomizerInfo {
  name: string;
  id: string; // firebase uid most likely
  items: string[];
}

interface RandomizerContextType {
  addRandomizeListener: (listener: () => void) => void;
  removeRandomizeListener: (listener: () => void) => void;
}

const RandomizerContext = createContext<RandomizerContextType>({
  addRandomizeListener: () => {},
  removeRandomizeListener: () => {},
});

export default function RandomizerPage() {
  const { showSnackbarMessage } = useContext(AppLayoutContext);

  const dataLoadCount = useRef<number>(0);

  const [listsData, listsAreLoading, listsFetchError] = useCollectionData(
    collection(getFirestore(firebaseApp), "lists"),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
      idField: "id",
    }
  );

  // increment counter for every additional load
  // then show "Lists updated" message
  useEffect(() => {
    dataLoadCount.current++;
    if (dataLoadCount.current > 2) showSnackbarMessage("Lists updated");
  }, [listsData, showSnackbarMessage]);

  return listsAreLoading ? (
    <LoadingScreen />
  ) : listsFetchError ? (
    <div>Error!</div>
  ) : (
    <Randomizer lists={listsData as unknown as RandomizerInfo[]} />
  );
}

function Randomizer({ lists }: { lists: RandomizerInfo[] }) {
  const [randomizeListeners, setRandomizeListeners] = useState<(() => void)[]>(
    []
  );

  const addRandomizeListener = useCallback(
    (listener: () => void) => {
      setRandomizeListeners((prevListeners) => [...prevListeners, listener]);
    },
    [setRandomizeListeners]
  );

  const removeRandomizeListener = useCallback(
    (listener: () => void) => {
      setRandomizeListeners((prevListeners) =>
        prevListeners.filter((item) => item !== listener)
      );
    },
    [setRandomizeListeners]
  );

  // run all
  const handleRandomizeAll = useCallback(() => {
    randomizeListeners.forEach((listener) => listener());
  }, [randomizeListeners]);

  return (
    <PaddedContainer>
      {lists.length === 0 ? (
        <Typography component="h2" variant="h5" textAlign="center">
          No lists available. Please try again later.
        </Typography>
      ) : (
        <RandomizerContext.Provider
          value={{ addRandomizeListener, removeRandomizeListener }}
        >
          <Button
            fullWidth
            variant="contained"
            size="large"
            sx={{ marginBottom: 3, height: "50px" }}
            onClick={handleRandomizeAll}
          >
            Randomize All
          </Button>
          <Grid container spacing={2} columns={{ xs: 1 }}>
            {lists.map(({ name, id, items }) => (
              <RandomizerWidget key={id} name={name} items={items} />
            ))}
          </Grid>
        </RandomizerContext.Provider>
      )}
    </PaddedContainer>
  );
}

function RandomizerWidget({ name, items }: { name: string; items: string[] }) {
  const [currentRandomItem, setCurrentRandomItem] = useState<string | null>(
    null
  );

  const { addRandomizeListener, removeRandomizeListener } =
    useContext(RandomizerContext);

  const handleRandomize = useCallback(() => {
    // set state making sure that the new
    // "random" item isn't the same as
    // the last time
    setCurrentRandomItem((previousItem) =>
      chooseRandomString(items, previousItem)
    );
  }, [items, setCurrentRandomItem]);

  useEffect(() => {
    // randomize when "randomize all" is clicked
    addRandomizeListener(handleRandomize);
    // cleanup
    return () => {
      removeRandomizeListener(handleRandomize);
    };
  }, [addRandomizeListener, removeRandomizeListener, handleRandomize]);

  return (
    <Grid item xs>
      <Card>
        <CardContent>
          <Typography
            textAlign="center"
            component="h2"
            variant="h5"
            gutterBottom
            mb={2}
          >
            {name}
          </Typography>
          <Box
            sx={{
              width: "100%",
              borderRadius: "3px",
              border: "1px solid #ddd",
              padding: "15px",
              boxSizing: "border-box",
              textAlign: "center",
            }}
            mb={2}
          >
            <Typography
              component="span"
              fontSize="17px"
              sx={{
                color:
                  items.length === 0
                    ? "error.main" // error red for empty list
                    : currentRandomItem
                    ? null
                    : "#666", // gray for nothing selected
              }}
            >
              {items.length === 0
                ? "List is empty"
                : currentRandomItem || "Click button to randomize"}
            </Typography>
          </Box>
          <Button
            fullWidth
            variant="contained"
            onClick={handleRandomize}
            disabled={items.length === 0}
          >
            Randomize
          </Button>
        </CardContent>
      </Card>
    </Grid>
  );
}

// choose a "random" item different from the last one shown
// NOTE: this isn't exactly random, as the method will not
// produce the same value twice in a row if provided with
// the previously selected string, unless the array has
// a length of 1 (which would be weird, wouldn't it?)
function chooseRandomString(
  arr: string[],
  previous?: string | null
): string | null {
  switch (arr.length) {
    case 0:
      return null; // return null for empty arrays
    case 1:
      return arr[0]; // return first item for one-item arrays
    case 2:
      // return the other item in a two-item array
      // or choose randomly if no previous
      return previous
        ? arr.find((item) => item !== previous)!
        : arr[Math.round(Math.random())];
    default:
      // for all other arrays, choose random item, as long
      // as it's not the last one we saw
      const randomItem = arr[Math.floor(Math.random() * arr.length)];
      return randomItem === previous
        ? chooseRandomString(arr, previous)
        : randomItem;
  }
}
