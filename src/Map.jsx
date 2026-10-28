import { MapContainer, TileLayer, CircleMarker, Popup, GeoJSON } from "react-leaflet";

import data from "./assets/4.5_week.geojson.json";
import boundaries from "./assets/plate_boundaries.geojson.json";


export const Map = ({ setEarthquakes }) => {
  const earthquakes = data.features; // Wir benötigen nur den Feature-Array aus den Daten

  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      style={{ height: "95vh", width: "100%" }}
    >
      <TileLayer
        url="https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}{r}.png"
        attribution={
        '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }
/>

      <GeoJSON data={boundaries} style={{ color: "grey", weight: 1}}/>

      {earthquakes.map((d, i) => (
        <CircleMarker
          key={i}
          center={[d.geometry.coordinates[1], d.geometry.coordinates[0]]}
          radius={d.properties.mag ** 1.5}
          pathOptions={{ color: "red" }}
        >
          <Popup>
            <div style={{ textAlign: "center" }}>
              {d.properties.title} <br />
              <button onClick={() => setEarthquakes(d)}>Details</button>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
};
