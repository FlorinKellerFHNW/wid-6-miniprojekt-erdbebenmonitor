export const Sidebar = ({ earthquakes }) => (
  <div className="aside">
    <aside>
      <p>Ort: {earthquakes.properties?.place ?? ""}</p>
      <p>Stärke: {earthquakes.properties?.mag ?? ""}</p>
      <p>Lat: {earthquakes.geometry?.coordinates?.[1] ?? ""}</p>
      <p>Lon: {earthquakes.geometry?.coordinates?.[0] ?? ""}</p>
      <p>
        Zeit:{" "}
        {earthquakes.properties?.time
          ? new Date(earthquakes.properties.time).toLocaleString()
          : ""}
      </p>
    </aside>
  </div>
);
