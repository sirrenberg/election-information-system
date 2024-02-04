--TODO: USE DB NORMALIZER TO NORMALIZE THIS DB!!!!
--TODO: Create matelialized views for the results of the election
--TODO: PRIMARY KEY? ? HINZUFÜGEN ODER NICHT?

CREATE EXTENSION IF NOT EXISTS pgcrypto;

DROP TABLE IF EXISTS wahlberechtigte CASCADE;
DROP TABLE IF EXISTS hatgewaehlt CASCADE;
DROP TABLE IF EXISTS stimmkreise CASCADE;
DROP TABLE IF EXISTS wahlkreise CASCADE;
DROP TABLE IF EXISTS anzahlStimmberechtigteUndWaehler CASCADE;
DROP TABLE IF EXISTS anzahlWaehler CASCADE;
DROP TABLE IF EXISTS parteien CASCADE;
DROP TABLE IF EXISTS kandidaten CASCADE;
DROP TABLE IF EXISTS kandidiert_erststimmen CASCADE;
DROP TABLE IF EXISTS kandidiert_zweitstimmen CASCADE;
DROP TABLE IF EXISTS erststimmen CASCADE;
DROP TABLE IF EXISTS zweitstimmen CASCADE;
DROP TABLE IF EXISTS first_names CASCADE;
DROP TABLE IF EXISTS last_names CASCADE;
DROP TABLE IF EXISTS voter_hashes CASCADE;



CREATE TABLE IF NOT EXISTS wahlkreise(
    wahlkreisid INT PRIMARY KEY,
    wahlkreisname VARCHAR(64),
    anzahlSitze INT,
    anteilStudentenProEinwohner FLOAT,
    schuldenDienstProEinwohner FLOAT
);
--TODO: Wie können wir das sinnvoll umsetzen?
CREATE TABLE IF NOT EXISTS stimmkreise(
    wahlkreisid INT REFERENCES wahlkreise(wahlkreisid),
    stimmkreisid INT PRIMARY KEY,
    name VARCHAR(64)
);

CREATE TABLE IF NOT EXISTS wahlberechtigte(
    waehlerid VARCHAR(128) PRIMARY KEY,
    vorname VARCHAR(64),
    nachname VARCHAR(64),
    passwort_hash TEXT NOT NULL,
    stimmkreisid INT REFERENCES stimmkreise(stimmkreisid)
);


CREATE TABLE IF NOT EXISTS anzahlStimmberechtigteUndWaehler(
    stimmkreisid INT  REFERENCES stimmkreise(stimmkreisid),
    datum DATE,
    anzahlStimmberechtigte INT,
    anzahlWaehler INT,
    PRIMARY KEY (stimmkreisid, datum)
);

CREATE TABLE IF NOT EXISTS parteien(
    parteiid INT PRIMARY KEY,
    parteiname VARCHAR(128),
    kurzbezeichnung VARCHAR(64),
    farbe VARCHAR(64)
);

CREATE TABLE IF NOT EXISTS kandidaten(
    kandidatenid INT PRIMARY KEY,
    kandidatennamen VARCHAR(128),
    parteiid INT REFERENCES parteien(parteiid)
);

CREATE TABLE IF NOT EXISTS kandidiert_erststimmen(
    kandidatenid INT,
    stimmkreisid INT, 
    datum DATE,
    anzahlStimmen INT,
    PRIMARY KEY (kandidatenid, stimmkreisid, datum)
);

CREATE TABLE IF NOT EXISTS kandidiert_zweitstimmen(
    kandidatenid INT,
    stimmkreisid INT, -- we collect the votes for the stimmkreis
    datum DATE,
    anzahlStimmen INT,
    PRIMARY KEY (kandidatenid, stimmkreisid, datum)
);

CREATE TABLE IF NOT EXISTS erststimmen(
    stimmeid SERIAL PRIMARY KEY,
    kandidatenid INT REFERENCES kandidaten(kandidatenid),
    stimmkreisid INT REFERENCES stimmkreise(stimmkreisid),
    datum DATE               --datum der wahl, nicht der stimmabgabe.
);

CREATE TABLE IF NOT EXISTS zweitstimmen(
    stimmeid SERIAL PRIMARY KEY,
    kandidatenid INT REFERENCES kandidaten(kandidatenid),
    stimmkreisid INT REFERENCES stimmkreise(stimmkreisid),
    datum DATE              --datum der wahl, nicht der stimmabgabe.
);

CREATE TABLE IF NOT EXISTS voter_hashes(
    hashvalue TEXT PRIMARY KEY
);

