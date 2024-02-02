--TODO: USE DB NORMALIZER TO NORMALIZE THIS DB!!!!
--TODO: Create matelialized views for the results of the election
--TODO: PRIMARY KEY? FOREIGN KEY? HINZUFÜGEN ODER NICHT?

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


CREATE TABLE IF NOT EXISTS wahlberechtigte(
    waehlerid VARCHAR(128) PRIMARY KEY,
    vorname VARCHAR(64),
    nachname VARCHAR(64),
    passwort_hash TEXT NOT NULL,
    stimmkreisid INT
);

--TODO: Wie können wir das sinnvoll umsetzen?
-- save as hashed value if the person has voted
CREATE TABLE IF NOT EXISTS hatgewaehlt(
    hashvalue VARCHAR(64),
    hatgewaehlt BOOLEAN
);

CREATE TABLE IF NOT EXISTS stimmkreise(
    wahlkreisid INT,
    stimmkreisid INT PRIMARY KEY,
    name VARCHAR(64)
);

CREATE TABLE IF NOT EXISTS wahlkreise(
    wahlkreisid INT PRIMARY KEY,
    wahlkreisname VARCHAR(64),
    anzahlSitze INT,
    anteilStudentenProEinwohner FLOAT,
    schuldenDienstProEinwohner FLOAT
);

CREATE TABLE IF NOT EXISTS anzahlStimmberechtigteUndWaehler(
    stimmkreisid INT,
    datum DATE,
    anzahlStimmberechtigte INT,
    anzahlWaehler INT,
    PRIMARY KEY (stimmkreisid, datum)
);

CREATE TABLE IF NOT EXISTS anzahlWaehler(
    stimmkreisid INT,
    datum DATE,
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
    parteiid INT
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
    stimmkreisid INT,
    datum DATE,
    anzahlStimmen INT,
    PRIMARY KEY (kandidatenid, stimmkreisid, datum)
);

CREATE TABLE IF NOT EXISTS erststimmen(
    stimmid SERIAL PRIMARY KEY,
    datum DATE, --datum der wahl, nicht der stimmabgabe.
    kandidatenid INT
);

CREATE TABLE IF NOT EXISTS zweitstimmen(
    stimmid SERIAL PRIMARY KEY,
    datum DATE, --datum der wahl, nicht der stimmabgabe.
    kandidatenid INT
);

CREATE TABLE first_names(
    name VARCHAR(64) PRIMARY KEY
);

CREATE TABLE last_names(
    name VARCHAR(64) PRIMARY KEY
);

