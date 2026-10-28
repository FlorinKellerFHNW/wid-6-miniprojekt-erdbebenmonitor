import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { Map } from "./Map";
import { useState } from "react";

import "./App.css";
import "leaflet/dist/leaflet.css";

function App() {

  const [earthquakes, setEarthquakes] = useState({});
  console.log(earthquakes);
  const [size, setSize] = useState(1);

  return (
    <div className="app">
      <Header />
      <Sidebar earthquakes={earthquakes} size={size} setSize={setSize} />
      <div className="mainArea">
        <Map setEarthquakes={setEarthquakes} size={size} />
      </div>
    </div>
  );
}

export default App;
