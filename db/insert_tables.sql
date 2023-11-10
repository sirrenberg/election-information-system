--TODO: USE DB NORMALIZER TO NORMALIZE THIS DB!!!!

--TODO: PRIMARY KEY? FOREIGN KEY? HINZUFÜGEN ODER NICHT?

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

CREATE TABLE IF NOT EXISTS Stimmkreise(
    stimmkreisid INT,
    name VARCHAR(64),
    wahlkreisid INT
);

CREATE TABLE IF NOT EXISTS wahlkreise(
    wahlkreisid INT,
    wahlkreisname VARCHAR(64)
);

CREATE TABLE IF NOT EXISTS kandidaten(
    kandidatenid INT,
    kandidatenvorname VARCHAR(64),
    kandidatennachname VARCHAR(64),
    parteiid INT
);

CREATE TABLE IF NOT EXISTS parteien(
    parteiid INT,
    parteiname VARCHAR(64)
);

CREATE TABLE IF NOT EXISTS kanditiertstimmkreis(
    kandidatenid INT,
    stimmkreisid INT,
    datum DATE
);


-- Wahlkreisliste können wir aus allen Stimmkreislisten erstellen.

CREATE TABLE IF NOT EXISTS kandidiertwahlkreisohnestimmkreis(
    kandidatenid INT,
    wahlkreisid INT,
    datum DATE
);

CREATE VIEW kandidiertwahlkreis as 
    SELECT ks.kandidatenid, s.wahlkreisid, ks.datum
    FROM kanditiertstimmkreis ks, stimmkreise s
    WHERE ks.stimmkreisid = s.stimmkreisid
    UNION
    SELECT *
    FROM kandidiertwahlkreisohnestimmkreis;

CREATE TABLE IF NOT EXISTS aggregiertestimmkreisergebnisse(
    kandidatenid INT,
    stimmkreisid INT,
    anzahlStimmen INT,
    datum INT
);

CREATE TABLE IF NOT EXISTS aggregiertewahlkreisergebnisse(
    kandidatenid INT,
    wahlkreisid INT,
    anzahlStimmen INT,
    datum INT
);

CREATE TABLE IF NOT EXISTS erststimmen(
    stimmid SERIAL PRIMARY KEY int,
    datum DATE, --datum der wahl, nicht der stimmabgabe.
    kandidatenid INT
);

CREATE TABLE IF NOT EXISTS zweitstimmen(
    stimmid SERIAL PRIMARY KEY int,
    datum DATE, --datum der wahl, nicht der stimmabgabe.
    kandidatenid INT
);

