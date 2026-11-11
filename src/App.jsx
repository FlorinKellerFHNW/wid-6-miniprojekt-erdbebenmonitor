import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { Map } from "./Map";
import { useState, useEffect } from "react";

import "./App.css";
import "leaflet/dist/leaflet.css";

function App() {

  const [earthquakes, setEarthquakes] = useState({});
  const [size, setSize] = useState(1); 
  const [quakeData, setQuakeData] = useState({});
  const [magnitude, setMagnitude] = useState("4.5");
  const [timeRange, setTimeRange] = useState("week");

  useEffect(() => {
  fetch(`https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/${magnitude}_${timeRange}.geojson`)

    .then(res => {
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }
    return res.json();
  })
    .then((res) => setQuakeData(res)).catch((err) => console.error("Fetch Failed", err));
}, [magnitude, timeRange]);


  return (
    <div className="app">
      <Header setMagnitude={setMagnitude} setTimeRange={setTimeRange} magnitude={magnitude} timeRange={timeRange} />
      <Sidebar earthquakes={earthquakes} size={size} setSize={setSize} />
      <div className="mainArea">
        <Map setEarthquakes={setEarthquakes} size={size} quakeData={quakeData} />
      </div>
    </div>
  );
}

export default App;
