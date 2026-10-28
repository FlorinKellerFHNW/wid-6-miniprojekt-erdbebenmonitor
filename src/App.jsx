import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { Map } from "./Map";
import { useState } from "react";

import "./App.css";
import "leaflet/dist/leaflet.css";

function App() {

  const [earthquakes, setEarthquakes] = useState({});
  console.log(earthquakes);

  return (
    <div className="app">
      <Header />
      <Sidebar earthquakes={earthquakes} />
      <div className="mainArea">
        <Map setEarthquakes={setEarthquakes} />
      </div>
    </div>
  );
}

export default App;
