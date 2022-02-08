// components
import { Box, Button, Card, Grid, Typography } from "@mui/material";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Add } from "@mui/icons-material";
// types
import { RandomizerInfo } from "../../interfaces/randomizer";

// context
import { AppLayoutContext } from "../../App";

// firebase
import { createList, removeItemFromList } from "../../utils/db";

const AdminListsContext = createContext<{
  currentListId: string | null;
  setCurrentListId: React.Dispatch<React.SetStateAction<string | null>>;
  listsData: RandomizerInfo[] | undefined;
}>({
  currentListId: null,
  setCurrentListId: () => {},
  listsData: undefined,
});

// 400px default size
const LIST_EDITOR_CARD_HEIGHT = 400;

export default function AdminLists() {
  const {
    lists: { data: listsData },
  } = useContext(AppLayoutContext);

  const [currentListId, setCurrentListId] = useState<string | null>(null);
  const isInitialLoad = useRef<boolean>(true);

  useEffect(() => {
    if (isInitialLoad.current && listsData && listsData[0]) {
      // show first list if available
      setCurrentListId(listsData[0].id);
      // no longer first load
      isInitialLoad.current = false;
    }
  }, [listsData]);

  return listsData ? (
    <AdminListsContext.Provider
      value={{ listsData, currentListId, setCurrentListId }}
    >
      <Typography component="p" variant="h6" gutterBottom>
        Edit Lists
      </Typography>
      <Card sx={{ height: LIST_EDITOR_CARD_HEIGHT }}>
        <Grid container spacing={2}>
          <Grid
            item
            xs={4}
            sx={{ position: "relative", height: LIST_EDITOR_CARD_HEIGHT }}
          >
            <AdminListsDrawer />
          </Grid>
          <Grid item xs={8}>
            <ListEditor />
          </Grid>
        </Grid>
      </Card>
    </AdminListsContext.Provider>
  ) : (
    <div>Loading...</div>
  );
}

function AdminListsDrawer() {
  const { listsData } = useContext(AdminListsContext);

  const handleNewList = useCallback(async () => {
    // get name of list from user input
    const listName = prompt("Name for new list:", "");

    // create in database
    if (listName && listName !== "") {
      createList(listName);
    }
  }, []);

  return (
    <Box
      sx={{
        position: "relative",
        height: "100%",
        overflow: "scroll",
      }}
    >
      <Box
        component="ul"
        sx={{
          listStyleType: "none",
          padding: 0,
        }}
      >
        {listsData?.map((list) => (
          <AdminListsDrawerRow list={list} key={list.id} />
        ))}
      </Box>
      <Box
        sx={{
          background:
            "linear-gradient(0deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.5) 60%, rgba(255,255,255,0) 100%)",
          position: "sticky",
          bottom: 0,
        }}
      >
        <Button
          sx={{ borderRadius: 0 }}
          startIcon={<Add />}
          onClick={handleNewList}
          fullWidth
        >
          New List
        </Button>
      </Box>
    </Box>
  );
}

function AdminListsDrawerRow({ list }: { list: RandomizerInfo }) {
  const { currentListId, setCurrentListId } = useContext(AdminListsContext);

  return (
    <Box component="li">
      <Button
        sx={{
          borderRadius: 0,
          justifyContent: "flex-start",
          color: "grey.800",
          backgroundColor:
            currentListId === list.id ? "rgba(0, 0, 0, 0.12) !important" : null,
          textTransform: "none",
        }}
        onClick={() => setCurrentListId(list.id)}
        fullWidth
      >
        <Box pl={1}>{list.name}</Box>
      </Button>
    </Box>
  );
}

function ListEditor() {
  const { listsData, currentListId } = useContext(AdminListsContext);

  const currentList = useMemo(
    () => listsData?.find((list) => list.id === currentListId),
    [listsData, currentListId]
  );

  return (
    <Box component="ul" sx={{ listStyleType: "none", padding: 0 }}>
      {currentList?.items.map((item, index) => (
        <ListEditorRow value={item} key={index + "_" + item} />
      ))}
      <Box component="li">
        <Button sx={{ mt: 1, borderRadius: 0 }} startIcon={<Add />} fullWidth>
          Add Words
        </Button>
      </Box>
    </Box>
  );
}

function ListEditorRow({ value }: { value: string }) {
  const { currentListId } = useContext(AdminListsContext);

  const handleDelete = useCallback(async () => {
    // remove value from array
    removeItemFromList(currentListId as string, value);
  }, [currentListId, value]);

  return (
    <li>
      {value}
      <button onClick={handleDelete}>Delete</button>
    </li>
  );
}
