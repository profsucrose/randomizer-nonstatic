import {
  useCallback,
  useState,
  useEffect,
} from "react";

// components
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";
import PaddedContainer from "../components/PaddedContainer";

// icons
import { Shuffle as ShuffleIcon } from "@mui/icons-material";

type List = {[category: string]: string};

export default function RandomizerPage() {
  return <Randomizer />;
}

enum RandomizerState {
  NotLoading,
  LoadingLists,
  LoadingNewLists
}

const getLists = async () => await (await fetch('/api/list')).json()

function Center({ children }: { children: any }) {
  return ( 
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      style={{ minHeight: '100vh', padding: '20px' }}
    >
      <Grid item xs={3}>
        {children}
      </Grid>
    </Grid>
  )
}

const millisToMinutesAndSeconds = (ms: number) => {
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000)
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds.toFixed(0)}`;
}

function Randomizer() {
  const [list, setList] = useState<List | null>(null)
  const [timeLeftForRefresh, setTimeLeftForRefresh] = useState<number | null>(null)
  const [isLoadingData, setIsLoadingData] = useState(RandomizerState.LoadingLists)

  useEffect(() => {
    if (isLoadingData === RandomizerState.LoadingLists ||
        isLoadingData === RandomizerState.LoadingNewLists) {
      getLists().then(data => {
        setList(data.list)
        setTimeLeftForRefresh(data.timeLeft)
        setIsLoadingData(RandomizerState.NotLoading)
      })
    }
  }, [isLoadingData, setIsLoadingData, setTimeLeftForRefresh])

  useEffect(() => {
    if (timeLeftForRefresh && timeLeftForRefresh > 0) {
      setTimeout(() => setTimeLeftForRefresh(timeLeftForRefresh - 1000), 1000)
    }
  }, [timeLeftForRefresh])

  const handleRandomizeAll = useCallback(() => {
    setIsLoadingData(RandomizerState.LoadingNewLists)
  }, [setIsLoadingData])

  return (
    <PaddedContainer>
      {isLoadingData === RandomizerState.LoadingLists || !list
        ? <Center children={
          <CircularProgress />
        } />
        : (!list
          ? (
            <Typography component="h2" variant="h5" textAlign="center">
              No list available. Please try again later.
            </Typography>
          ) 
          : (
            <>
              <Button
                fullWidth
                variant="contained"
                size="large"
                sx={{ marginBottom: 3, height: "50px" }}
                onClick={handleRandomizeAll}
                startIcon={<ShuffleIcon />}
                disabled={timeLeftForRefresh! > 0}
              >
                {timeLeftForRefresh! > 0 ? `Can Randomize Again In ${millisToMinutesAndSeconds(timeLeftForRefresh!)}`
                  : "Randomize All"}
              </Button>
              {isLoadingData === RandomizerState.LoadingNewLists 
                ? <Center children={<CircularProgress />} />
                : (
                  <Grid
                    container
                    spacing={2}
                    columns={{ xs: 1, sm: 1, md: 3, lg: 3, xl: 3 }}
                  >
                    {Object.entries(list).map(([category, item], index) => 
                      <RandomizerWidget key={index} name={category} item={item} />
                    )}
                  </Grid>
                )}
            </>
          ))}
    </PaddedContainer>
  );
}

function RandomizerWidget({ name, item }: { name: string; item: string }) {
  return (
    <Grid item xs={1} sm={1} md={1} lg={1} xl={1}>
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
                color: item || "#666"
              }}
            >
              {item}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );
}