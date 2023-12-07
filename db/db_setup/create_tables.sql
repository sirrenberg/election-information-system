--TODO: USE DB NORMALIZER TO NORMALIZE THIS DB!!!!
--TODO: Create matelialized views for the results of the election
--TODO: PRIMARY KEY? FOREIGN KEY? HINZUFÜGEN ODER NICHT?

DROP TABLE IF EXISTS wahlberechtigte;
DROP TABLE IF EXISTS hatgewaehlt;
DROP TABLE IF EXISTS stimmkreise;
DROP TABLE IF EXISTS wahlkreise;
DROP TABLE IF EXISTS anzahlWahlberechtigte;
DROP TABLE IF EXISTS parteien;
DROP TABLE IF EXISTS kandidaten;
DROP TABLE IF EXISTS kandidiert_erststimmen;
DROP TABLE IF EXISTS kandidiert_zweitstimmen;
DROP TABLE IF EXISTS erststimmen;
DROP TABLE IF EXISTS zweitstimmen;


CREATE TABLE IF NOT EXISTS wahlberechtigte(
    waehlerid VARCHAR(64) PRIMARY KEY,
    vorname VARCHAR(64),
    nachname VARCHAR(64),
    wohnort VARCHAR(64), --keine Funktionale Abhängigkeit zu Stimmkreis, weil aus München nicht ersichtlich, welcher Stimmkreis
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

CREATE TABLE IF NOT EXISTS anzahlWahlberechtigte(
    stimmkreisid INT,
    datum DATE,
    anzahlWahlberechtigte INT,
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

