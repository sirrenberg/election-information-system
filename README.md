# election-information-system


## Create a Docker image with build
```
docker build -t <my-docker-image-name> .
docker run -d --name <my-postgres-container> -p 5432:5432 <my-docker-image-name>
```

## Run only the backend docker container
```


## Connect VSCode with postgres database
```
SQLTools (by Matheus Teixeira)
SQLTools PostgreSQL/Cockroach Driver (by Matheus Teixeira)
```

## Install Vite for Docker compose (which is faster than Docker build due to hot file update)
```
npm create vite@latest (Select Name:frontend Framework:React and Variant:Typescript)
cd frontend
npm install
npm run dev
```

click on http://localhost:5173/ and count up.

## Setting Up Backend with TypeScript

```
npm init -y
npm install --save-dev typescript
npm install express
npx tsc
node dist/app.js
```

## Create all three docker container at once.
```
docker compose up
```

## API
- Express
- Aufgabenblatt 6
  - Q1: Sitzverteilung.: (ParteiFarbe, ParteiKurzbezeichnung, AnzahlSitze), angezeigt in Sitzverteilung
  - Q2: Mitglieder des Landtages: (Name, Partei, Wahlkreis) in Übersichten
  - Q3: Wahlkreisübersicht: (Wahlbeteiligung, NameGewählterDirektkandidat, ParteiKurzbezeichnung, ProzentualeAnzahlStimmenJederPartei, AbsoluteAnzahlStimmenJederPartei) in Ergebnisse
  - Q4: Stimmkreissieger: (Wahlkreisname, Siegerpartei, ErststimmenSiegerPartei, ZweitstimmenSiegerPartei) in Übersichten
  - Q5: Überhangmandate: (Wahlkreisname, Partei, AnzahlÜberhangMandate) in Übersichten
  - Q6: Knappste Sieger: (NameKandidat, Partei, Stimmkreis, AnzahlStimmenDifferenz (positiv wenn gewonnen, negativ wenn verloren)) in Übersichten
  - Q7: Wahlkreisübersicht: (Wahlbeteiligung, Partei, Parteifarbe, NameGewählterDirektkandidat, ProzentualeAnzahlStimmenfürKandidat, AbsoluteAnzahlStimmenfürKandidat) in Übersichten
  - Schuldendienste-vs-anteilStimmen (Parteiname, SchuldendienstProEinwohner, StimmenAnteil, Wahlkreisname ) (vielleicht als Punktgraph mit Namen der Wahlkreise)
  - Anzahl an eingeschriebenen Studenten vs anteilStimmen: (Parteiname, AnzahlEingeschriebeneStudenten, StimmenAnteil, Wahlkreisname )