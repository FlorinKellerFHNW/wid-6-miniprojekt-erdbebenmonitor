# Learnings: Erdbebenmonitor (React-Leaflet und MUI)

Zusammenfassung der Aufgaben 1.1 bis 2.4 mit kurzer Theorie und je einem Codebeispiel.

---

## 1. React-Leaflet

### 1.1 MapContainer: center und zoom

**Theorie:** `MapContainer` erzeugt die Leaflet-Karte. `center` ist `[lat, lon]`, `zoom` eine Zahl (2 = ganze Welt, höher = näher). Die Leaflet-Instanz wird nicht per Hot Reload aktualisiert, die Seite muss manuell neu geladen werden (STRG+R). Damit die Karte sichtbar ist, braucht der Container eine Höhe und das Leaflet-CSS muss importiert sein (`import "leaflet/dist/leaflet.css"`).

```jsx
<MapContainer center={[20, 0]} zoom={2} style={{ height: "95vh", width: "100%" }}>
```

### 1.2 TileLayer: Basiskarte

**Theorie:** Die `TileLayer` lädt Kartenkacheln über eine URL-Vorlage. `{z}/{x}/{y}` füllt Leaflet selbst aus, `{r}` steht für Retina-Auflösung. `{ext}` muss man durch `png` ersetzen. Die `attribution` ist Pflicht (Lizenz). Enthält sie HTML mit doppelten Anführungszeichen, steht sie als JS-Ausdruck in `{ }` mit einfachen Anführungszeichen.

```jsx
<TileLayer
  url="https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}{r}.png"
  attribution={'&copy; <a href="https://www.stadiamaps.com/">Stadia Maps</a>'}
/>
```

### 1.3 CircleMarker: Vector Overlays

**Theorie:** `CircleMarker` zeichnet eine Kreisfläche statt eines Pins. Der Radius ist in Pixeln. Das Prop heisst `center` (nicht `position` wie bei `Marker`, und nicht `centre`). USGS liefert Koordinaten als `[lon, lat, depth]`, Leaflet erwartet `[lat, lon]`, also werden Index 1 und 0 vertauscht. `pathOptions` braucht doppelte Klammern: aussen JSX, innen Objekt.

```jsx
<CircleMarker
  center={[d.geometry.coordinates[1], d.geometry.coordinates[0]]}
  radius={d.properties.mag ** 1.5}
  pathOptions={{ color: "red" }}
/>
```

### 1.4 GeoJSON einbinden

**Theorie:** Die `GeoJSON`-Komponente zeichnet GeoJSON-Daten (hier Plattengrenzen). GeoJSON ist immer lon/lat, Leaflet übernimmt die Umrechnung selbst. Die Reihenfolge im Code bestimmt die Zeichenreihenfolge: spätere Elemente liegen oben, die Linien gehören also vor die Kreise. Backticks um die Komponente würden als Text gerendert und gehören nicht in JSX.

```jsx
import boundaries from "./assets/plate_boundaries.geojson.json";

<GeoJSON data={boundaries} style={{ color: "grey", weight: 1 }} />
```

### 1.5 State und Interaktion

**Theorie:** Zwei Geschwister-Komponenten teilen Daten über ihren gemeinsamen Elternteil ("State hochziehen"). Der State liegt in der `App`, Daten fliessen per Props nach unten, Änderungen per Funktions-Prop nach oben. Props kommen als Objekt an, in der Kind-Komponente holt man sie per Destructuring `({ name })`. Der Name muss auf beiden Seiten identisch sein. Im `onClick` braucht es eine Pfeilfunktion, sonst läuft der Aufruf beim Rendern sofort los (Endlosschleife).

```jsx
// App.jsx
const [earthquake, setEarthquake] = useState({});
<Map setEarthquake={setEarthquake} />

// Map.jsx
export const Map = ({ setEarthquake }) => { ... }
<button onClick={() => setEarthquake(d)}>Details</button>
```

### 1.6 State in der Seitenleiste anzeigen

**Theorie:** Der Start-State ist `{}`, es gibt noch keine Eigenschaften. Direkter Zugriff wie `earthquake.geometry.coordinates` wirft einen Fehler und die ganze App stürzt ab (leere Seite).
- Optional Chaining `?.` bricht bei `undefined` ab und liefert `undefined`.
- Nullish Coalescing `??` ersetzt `undefined` oder `null` durch einen Ersatzwert.
- `time` ist ein Zeitstempel in ms, `new Date(ms).toLocaleString()` macht daraus Text.

```jsx
export const Sidebar = ({ earthquake }) => (
  <aside>
    <p>Ort: {earthquake.properties?.place ?? ""}</p>
    <p>Lat: {earthquake.geometry?.coordinates?.[1] ?? ""}</p>
    <p>
      Zeit:{" "}
      {earthquake.properties?.time
        ? new Date(earthquake.properties.time).toLocaleString()
        : ""}
    </p>
  </aside>
);
```

---

## 2. Material UI (MUI)

**Allgemein:** MUI liefert vorgefertigte UI-Komponenten. Man importiert sie einzeln (`import Button from "@mui/material/Button"`). Gestaltet wird über Props mit vordefinierten Strings (`variant`, `color`, `size`) und über `sx` (wie Inline-CSS, aber als Objekt in camelCase).

### 2.1 Button

**Theorie:** Direktes Äquivalent zum HTML-`button`. Der `onClick`-Handler bleibt gleich. Die erlaubten Werte stehen in der Component API. Ein Tippfehler im String wirkt nicht und gibt keinen Fehler.

```jsx
import Button from "@mui/material/Button";

<Button variant="contained" color="primary" size="small" onClick={() => setEarthquake(d)}>
  Details
</Button>
```

### 2.2 Typography

**Theorie:** Ersetzt die HTML-Elemente `h1` bis `h6` und `p`. Die Grösse steuert `variant`. Der Text gehört zwischen öffnendes und schliessendes Tag. Mit `component="h1"` lässt sich das HTML-Element vom Aussehen trennen. Die Schrift Roboto muss einmalig in `main.jsx` importiert werden, sonst greift die Standardschrift.

```jsx
import Typography from "@mui/material/Typography";

<Typography variant="h4" sx={{ color: "#1565c0" }}>
  IGEO Erdbebenmonitor
</Typography>
```

### 2.3 Card

**Theorie:** Eine Card besteht aus mehreren Komponenten: `Card` (Rahmen), `CardContent` (Innenabstand) und `Typography` (Text). Es gibt kein HTML-Äquivalent. `variant="outlined"` zeichnet einen Rand statt Schatten, `gutterBottom` fügt Abstand unter dem Text ein.

```jsx
<Card variant="outlined">
  <CardContent>
    <Typography variant="h6" gutterBottom>
      {earthquake.properties?.place ?? "Kein Erdbeben ausgewählt"}
    </Typography>
    <Typography>Stärke: {earthquake.properties?.mag ?? ""}</Typography>
  </CardContent>
</Card>
```

### 2.4 Slider steuert die Karte

**Theorie:** Der Slider ist eine "controlled component": `value` kommt aus dem State, `onChange` aktualisiert ihn. Der neue Wert steckt im **zweiten** Argument von `onChange(event, newValue)`. `min`, `max` und `step` sind Zahlen in `{ }`. Mit `defaultValue` statt `value` wäre der Slider nicht an den State gebunden. Der Startwert muss im Bereich zwischen `min` und `max` liegen. Der State liegt wieder in der `App`, die Sidebar schreibt, die Map liest. Leaflet aktualisiert den Radius automatisch bei Prop-Änderungen. Hat eine Komponente vor dem `return` noch Code (z. B. `handleChange`), wechselt der Pfeil-Body von `( ... )` zu `{ ... return ( ... ); }`.

```jsx
// App.jsx
const [size, setSize] = useState(1);
<Sidebar earthquake={earthquake} size={size} setSize={setSize} />
<Map setEarthquake={setEarthquake} size={size} />

// Sidebar.jsx
const handleChange = (event, newValue) => setSize(newValue);

<Box sx={{ width: 200, p: 2 }}>
  <Slider value={size} onChange={handleChange} min={1} max={3} step={0.5} marks />
</Box>

// Map.jsx
<CircleMarker radius={d.properties.mag ** size} ... />
```

---

## Typische Fehler (aus diesem Projekt)

| Symptom | Ursache |
|---|---|
| Karte nicht sichtbar | `centre` statt `center` am `CircleMarker` |
| Seite komplett leer | Prop-Name in Eltern- und Kind-Komponente verschieden, dadurch `undefined.properties` |
| Seite komplett leer | Fehlende schliessende `}` einer Funktion (Syntaxfehler, Vite meldet es im Overlay) |
| Attribution-Fehler | Doppelte Anführungszeichen im String-Attribut, JS-Ausdruck mit `'...'` verwenden |
| Text erscheint unformatiert | Text steht ausserhalb des `Typography`-Tags |
| Kreise winzig | Slider-Startwert 0, `mag ** 0` ist immer 1 |
| Backticks sichtbar auf der Karte | Backticks um eine JSX-Komponente |

**Debugging-Tipp:** Zuerst Browserkonsole (F12) und Vite-Fehlerfenster ansehen, die Meldung nennt meist Datei und Zeile.
