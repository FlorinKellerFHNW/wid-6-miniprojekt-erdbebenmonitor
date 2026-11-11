import Typography from "@mui/material/Typography";
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Stack from '@mui/material/Stack';

export const Header = ({ setMagnitude, setTimeRange, magnitude, timeRange }) => (
  <div className="header">
    <header>
      <Typography variant="h4" sx={{ color: "#1565c0" }} >
        IGEO Erdbebenmonitor
      </Typography>

      <Typography variant="subtitle1" sx={{ color: "#1565c0" }} >
        Magnitude: {magnitude} | Zeitraum: {timeRange}
      </Typography>

      <Stack>
        <ButtonGroup variant="contained" aria-label="Basic button group">
          <Button onClick={() => setMagnitude("significant")}>significant</Button>
          <Button onClick={() => setMagnitude("4.5")}>4.5</Button>
          <Button onClick={() => setMagnitude("2.5")}>2.5</Button>
          <Button onClick={() => setMagnitude("1.0")}>1.0</Button>
          <Button onClick={() => setMagnitude("all")}>all</Button>
        </ButtonGroup>

        <ButtonGroup variant="outlined" aria-label="Zeitintervall">
          <Button onClick={() => setTimeRange("hour")}>hour</Button>
          <Button onClick={() => setTimeRange("day")}>day</Button>
          <Button onClick={() => setTimeRange("week")}>week</Button>
          <Button onClick={() => setTimeRange("month")}>month</Button>
        </ButtonGroup>
      </Stack>
    </header>
  </div>
);


