import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Slider from "@mui/material/Slider";
import Box from "@mui/material/Box";


export const Sidebar = ({ earthquakes, size, setSize }) => {
  const handleChange = (event, newValue) => {
    setSize(newValue);
  };

  return (
  <div className="aside">
    <aside>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {earthquakes.properties?.place ?? "Kein Erdbeben ausgewählt"}
          </Typography>
          <Typography>
            Stärke: {earthquakes.properties?.mag ?? ""}
          </Typography>
          <Typography>
            Lat: {earthquakes.geometry?.coordinates?.[1] ?? ""}
          </Typography>
          <Typography>
            Lon: {earthquakes.geometry?.coordinates?.[0] ?? ""}
          </Typography>
          <Typography>
            Zeit:{" "}
            {earthquakes.properties?.time
              ? new Date(earthquakes.properties.time).toLocaleString()
              : ""}
          </Typography>
        </CardContent>
      </Card>
      <Box sx={{ width: 200, p: 2 }}>
          <Slider
            aria-label="Kreisgrösse"
            value={size}
            onChange={handleChange}
            min={1}
            max={3}
            step={0.5}
            marks
            valueLabelDisplay="auto"
          />
        </Box>
    </aside>
  </div>
);
}
