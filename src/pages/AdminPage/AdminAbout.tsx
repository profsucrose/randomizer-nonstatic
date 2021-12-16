// components
import { Link, Typography } from "@mui/material";

// config
import { version as appVersion } from "../../../package.json";

export default function AdminAbout() {
  return (
    <>
      <Typography component="p" variant="h6" gutterBottom>
        Art Randomizer
      </Typography>
      <Typography variant="body1" fontWeight="500" gutterBottom>
        Version {appVersion}
      </Typography>
      <Typography variant="body1">
        Created for Jeff Miller by Zane St. John
      </Typography>
      <Typography variant="body1">
        <Link
          href="https://github.com/zane-programs/art-randomizer"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub Repo
        </Link>
      </Typography>
    </>
  );
}
