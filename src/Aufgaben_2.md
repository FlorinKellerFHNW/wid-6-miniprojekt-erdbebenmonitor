# Web APIs

## Aufgabe 1 - Einen einzelnen Datensatz über die API anfragen

Die Daten für die Erdbebenkarte stammen von der USGS-Webseite und bilden die Erdbeben der Stufe 4.5+ innerhalb der letzten Woche ab. Um die Daten aktuell zu halten, sollen diese nun direkt vom USGS Feed über eine API-Anfrage bezogen werden.

### 1.1 State hinzufügen

Füge der App.jsx einen useState-Hook hinzu. Dieser soll als "Default Wert" ein leeres Objekt enthalten und später mit Erdbeben gefüllt werden. Hier wird der von der API bezogenen Datensatz im Frontend gespeichert.

### 1.2 useEffect-Hook benutzen

Der useEffect-Hook wird benutzt, damit die Anfrage an die API nur 1x erfolgt. Andernfalls würde bei jedem neuen Rendering (z.B. durch ein beliebiges State-Update in der App.jsx) eine weitere Anfrage gesendet werden.

- Füge in der App.jsx den useEffect-Hook aus dem Beispiel (s.u.) ein.
- Passe die URL der fetch-Funktion an. Wähle dafür eine URL vom USGS Feed. Je mehr Daten der Feed zurück gibt (z.B. Monat + geringe Magnitude), desto länger dauert der initiale Aufruf der App.
- Im zweiten `.then()` verwendest du deine setState Funktion aus 1.1, um "res" in State zu speichern. Dies ist der Erdbebendatensatz, den der Server basierend auf der Anfrage zurückgegeben hat.
- Die Abhängigkeitsliste (`[]`) sollte leer bleiben - der Code wird dann nur einmal, d.h. beim ersten Rendering ausgeführt.

```
// Syntax:
  useEffect(() => {
    fetch(eineURL)
      .then((res) => res.json())
      .then((res) => eineSetStateFunktion(res));
  },
  []  // Abhängigkeitsliste, hier leer
  );
```

### 1.3 Error Handling

Anfragen an einen Server können fehlschlagen - die URL existiert nicht, der Server ist nicht erreichbar, der Response kann nicht geparst werden, etc. Zwei Stellen innerhalb der fetch()-Funktion bzw. des "Promise" eignen sich, um Fehler anzufangen:

- Füge hinter dem zweiten `.then()` aber VOR dem `;` eine [.catch()](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch)-Funktion ein. Diese kannst du ebenfalls als Pfeilfunktion schreiben: `.catch(err => console.error("Fetch failed:", err));`
  Die Catch-Funktion fängt Netzwerk- und Syntaxfehler ab, aber keine Fehler in denen der Promise "erfüllt" wird. Ein Promise der "404" und keine Daten zurückgibt, ist erfüllt und würde von .catch() nicht abgefangen. Um auch über diese Fehler informiert zu werden, muss die erste `.then()`-Funktion erweitert werden.
- Ersetzte `.then((res) => res.json())` mit diesem Code:

```
.then(res => {
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }
    return res.json();
  })
```

### 1.4 State mit Props von der App.jsx an die Map.jsx leiten

Nutze Props um die State-Variable (die Erdbeben) von der App.jsx an die Map.jsx zu leiten.

### 1.5 Daten in der Map-Komponente verwenden

In der Karte benötigen wir nur die "features" aus dem Erdbebenobjekt, welches mit Props aus State weitergeleitet wird.

- Passe diese Zeile an:

```
const earthquakes = data.features;  // Ersetze "data" durch den Namen deines Prop
```

- Entferne nun noch den Import der lokalen JSON-Datei (4.5_week.geojson.json) und teste ob die Karte die Daten anzeigt.

Sehr wahrscheinlich wird dir jetzt ein Fehler in der Browser-Konsole angezeigt. Öffne diese (STRG + SHIFT + I, auf Tab "Konsole" wechseln) um dir die Fehlermeldung anzusehen: `Uncaught TypeError: can't access property "map", earthquakes is undefined` Was bedeutet das? </br>
In der Zeile `const earthquakes ...` versuchen wir den features-Array aus dem Erdbebenobjekt (aus der API-Anfrage) der Variable "earthquakes" zuzuweisen. Die API-Anfrage benötigt etwas Zeit, in welcher React bereits die UI rendert und versucht über die Erdbeben zu iterieren (`map()`). Zu diesem Zeitpunkt ist "earthquakes" noch "undefined", ein Fehler wird geworfen und das weitere Rendering abgebrochen. Eine Möglichkeit, diesen Fehler abzufangen, ist ein "Fallback" - ein Wert der verwendet wird, wenn der eigentliche Wert nicht vorhanden ist.

- Ändere die Zeile nochmals, indem du das `;`ersetzt durch: `|| [];` - das logische "OR" (`||`) prüft den linken Wert, ist dieser "undefined" wird der rechte Wert (`[]`) verwendet.

Die ganze Zeile sollte etwas so aussehen:

```
const earthquakes = myPropName.features || [];
```

### Exkurs: Den Fall berücksichtigen, dass Daten für das Rendern der UI fehlen

Wenn Daten über eine API bezogen werden, besteht die Möglichkeit, dass diese nicht (z.B. bei einem Server- oder Netzwerkproblem) oder nicht rechtzeitig (d.h vor dem ersten Rendering im Browser) verfügbar sind.
Dieser Fall muss in der UI bzw. im Code berücksichtigt werden, damit der Browser _immer_ eine Anweisung hat, was gerendert werden soll - einen Fallback-Wert, eine Fehlermeldung, einen Platzhalter, einen Ladebalken usw.
Wie das im Code am besten umgesetzt wird, hängt von dem jeweiligen Anwendungsfall und den Datentypen ab. Die Möglichkeiten sind zu vielfältig um sie hier einzeln darzustellen, daher nur ein paar ganz grundlegende Tipps:

- Verwende immer einen "default-Wert" für den useState-Hook.
- Verwende logische Operatoren (`||, &&, ??`) für Fallback-Werte oder "conditional rendering"
- Verwende den ternären Operator, um z.B. eine UI-Alternative anzubieten.

```
// Beispiel:
export const Map = () => {
  //...
  earthquakes && earthquakes.length > 0
    ? return (...dein bisheriger Code)
    : return (...z.B. ein div mit "Fehler")
}
```

---

## Aufgabe 2 - Interaktive Abfragen an die API

Bislang zeigt die Karte nur einen einzigen Datensatz. USGS hat aber auch Daten für andere zeitliche Auflösungen und Magnituden. Im Folgenden soll den Nutzenden der Erdbebenkarte die Möglichkeit gegeben werden, eine zeitliche Auflösung und die Schwere (Magnitude) der Erdbeben zu bestimmen. Für eine Umsetzung gibt es verschiedene Möglichkeiten - in diesem Fall soll jeweils ein (1) Datensatz anwählbar sein und die Abfrage automatisch, basierend auf der Änderung eines der beiden Filter (Zeitintervall, Magnitude) erfolgen.

### 2.1 State hinzufügen:

Lege in der App.jsx zwei neue useState-Hooks an:

- Der Erste soll Magnituden (als String) speichern. Wähle eine der Magnituden aus deiner Liste als "Default-Wert".
- Der Zweite soll ein Zeitintervall, z.B. Woche (als String) speichern. Wähle auch hier wieder einen Wert aus deiner Liste aus.
  **Hinweis:** Warum nicht leere Strings als Default-Werte? Die App führt später den Code beim ersten Rendern aus und sendet damit eine Anfrage an den Server. Bei der Verwendung von sinnvollen Werten kann direkt ein Datensatz vom Server abgefragt werden, während leere Strings einen Fehler in der Anfrage ergeben werden.

### 2.2 Interaktionselemente anlegen:

Finde in der MUI-Referenz die "ButtonGroup"-Komponente. Sie besteht aus einer äusseren Komponente und mehreren Buttons. Übertrage den Beispielcode in die **Header**-Komponente (als Kinder der `<Stack>`-Komponente) und passe diesen an. Jede der (fünf) Magnituden soll einen Button erhalten, der

- den Text der Magnitude hat
- einen onClick Handler besitzt, welcher die jeweilige Magnitude (als String) in State speichert.

Für das Zeitintervall wiederholst du diese Arbeitsschritte.

### 2.3 Props verwenden

Leite die beiden setState-Funktionen aus 2.1 mit Props an den Header weiter, sodass sie in den jeweiligen onClick-Handlern der Buttons verwendet werden können. Füge in der App.jsx unter den beiden Hooks aus 2.1 zwei console.log() ein, welche jeweils eine der beiden neuen State-Variablen (für Magnitude und Zeitintervall) loggen. Klicke die Buttons und überprüfe in der Browser-Konsole, ob der richtige Wert in State gespeichert - bzw. geloggt wird.

### 2.4 Die URL für fetch() anpassen & die Abhängigkeitsliste des useEffect-Hooks erweitern

Wir können nun die beiden State-Variablen und einen [Template String](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Template_literals) verwenden, um die Datenabfrage interaktiv zu gestalten.

```
// Syntax
"ein gewöhnlicher String"
`ein Template String in dem eine ${variable} verwendet wird`  // beachte die besonderen Anführungszeichen!
```

- Schreibe die URL so um, dass für Magnitude und Zeitintervall die State-Variable verwendet wird.

In diesem Projekt verwenden wir keinen zusätzlichen Button, um Anfragen an den Server aktiv zu senden (z.B. mit einem Klick-Event).
Stattdessen können wir den useEffect-Hook so "einstellen", dass eine Anfrage immer dann erfolgt, wenn sich die "Abhängigkeitsliste" ändert.

```
// Erinnerung
useEffect( eineFunktion, eine Abhängigkeitsliste)   // Pseudocode
useEffect(fetch(...), [variable1, variable2]) // Ändert sich Variable 1 oder 2, wird die Funktion im Hook erneut ausgeführt.

```

Wenn wir in der Abhängigkeitsliste die beiden State-Variablen verwenden (und diese sich durch einen Button-Klick ändern), erfolgt als Folge der State-Änderung immer eine neue Anfrage an den Server. Dies ist genau das, was wir wollen: Der User wählt eine andere Magnitude oder ein anderes Zeitintervall und neue Daten werden (automatisch) geladen.

### 2.5 Abschluss: Test & Code bereinigen

- Funktioniert alles wie gedacht?
- Entferne auskommentierten Code, `console.log()`-Statements und nicht benötigte Imports.
- Checke deinen Code in Git ein und pushe diesen in dein Repo.

### 2.6 Optional: Die gewählten Einstellungen anzeigen

Die Nutzenden sehen aktuell nicht, welche Einstellungen (Magnitude, Zeiteinheit) sie ausgewählt haben. Diese Information liesse sich z.B. auch im Header anzeigen. Übergib die beiden State-Variablen mit Props an den Header und nutze sie z.B. in einer Typography-Komponente.

### 2.7 - Optional: Verbesserung der ButtonGroup-Komponenten

In den ButtonGroups wird jeder Button einzeln definiert. Stattdessen liessen sich diese auch dynamisch erzeugen.
Orientiere dich an diesem Beispiel und übertrage das Konzept auf deinen Anwendungsfall:

```
// Ein Array mit allen möglichen / nötigen Werten:
const todos = ["a", "b", "c"]

// Ein äusseres Element
<ol>
// Dynamische Erzeugung von Kindelementen (li), durch Iteration (mit .map()) über den Array.
{
todos.map(todo, i) => <li key={i}>{todo}</li>
}

```
Anstatt von `<li>` nutzt du eine `<Button />` Komponente von MUI, anstatt von `<ol>` die ButtonGroup oder eine Stack-Komponente von MUI. Die "todos" wären in deinem Fall die Zeitintervalle und Magnituden. Im onClick-Event-Handler schreibst du den jeweiligen Wert in State. Verwende dazu die Variable (Parameter) deiner .map() Funktion (im Beispiel "todo" genannt - das ist der jeweilige Wert aus dem Array).