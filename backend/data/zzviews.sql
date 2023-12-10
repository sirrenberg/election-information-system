CREATE MATERIALIZED VIEW erststimmenProKandidatProWahlkreis as (
    SELECT ks.kandidatenid, ks.datum, s.wahlkreisid, sum(ks.anzahlStimmen) as anzahlStimmen
    FROM kandidiert_erststimmen ks, stimmkreise s
        WHERE ks.stimmkreisid = s.stimmkreisid AND ks.datum = '2023-10-08'
    GROUP BY ks.kandidatenid, ks.datum, s.wahlkreisid
);

--Works
CREATE MATERIALIZED VIEW zweitstimmenProKandidatProWahlkreis as (
    SELECT zs.kandidatenid, zs.datum, s.wahlkreisid, sum(zs.anzahlStimmen) as anzahlStimmen
    FROM kandidiert_zweitstimmen zs, stimmkreise s
        WHERE zs.stimmkreisid = s.stimmkreisid AND zs.datum = '2023-10-08'
    GROUP BY zs.kandidatenid, zs.datum, s.wahlkreisid
);

--Works
CREATE MATERIALIZED VIEW gesamtStimmenProKandidatProWahlkreis as (
    SELECT COALESCE(ks.kandidatenid, zs.kandidatenid) as kandidatenid,
            COALESCE(ks.datum, zs.datum) as datum,
                COALESCE(ks.wahlkreisid, zs.wahlkreisid) as wahlkreisid,
                 (COALESCE(ks.anzahlStimmen, 0) + COALESCE(zs.anzahlStimmen, 0)) as anzahlStimmen
    FROM erststimmenProKandidatProWahlkreis ks 
    FULL OUTER JOIN zweitstimmenProKandidatProWahlkreis zs ON ks.kandidatenid = zs.kandidatenid and ks.wahlkreisid = zs.wahlkreisid 
);

-------------------------------------------------------------------------
--Works
CREATE MATERIALIZED VIEW erststimmenProParteiProWahlkreis as (
    SELECT p.parteiid, p.parteiname, p.kurzbezeichnung, p.farbe, ks.datum, ks.wahlkreisid, sum(ks.anzahlStimmen) as anzahlStimmen
    FROM erststimmenProKandidatProWahlkreis ks, kandidaten k, parteien p
    WHERE ks.kandidatenid = k.kandidatenid AND k.parteiid = p.parteiid
    GROUP BY p.parteiid, p.parteiname, p.kurzbezeichnung, p.farbe, ks.datum, ks.wahlkreisid
);

--Works
CREATE MATERIALIZED VIEW zweitstimmenProParteiProWahlkreis as (
    SELECT p.parteiid, p.parteiname, p.kurzbezeichnung, p.farbe, zs.datum, zs.wahlkreisid, sum(zs.anzahlStimmen) as anzahlStimmen
    FROM zweitstimmenProKandidatProWahlkreis zs, kandidaten k, parteien p
    WHERE zs.kandidatenid = k.kandidatenid AND k.parteiid = p.parteiid
    GROUP BY p.parteiid, p.parteiname, p.kurzbezeichnung, p.farbe, zs.datum, zs.wahlkreisid
);

--Works
CREATE MATERIALIZED VIEW gesamtStimmenProParteiProWahlkreis as (
    SELECT COALESCE(ks.parteiid, zs.parteiid) as parteiid,
            COALESCE(ks.parteiname, zs.parteiname) as parteiname,
            COALESCE(ks.parteikurzbezeichnung, zs.parteikurzbezeichnung),
            COALESCE(ks.parteifarbe, zs.parteifarbe),
            COALESCE(ks.datum, zs.datum) as datum,
                COALESCE(ks.wahlkreisid, zs.wahlkreisid) as wahlkreisid,
                 (COALESCE(ks.anzahlStimmen, 0) + COALESCE(zs.anzahlStimmen, 0)) as anzahlStimmen
    FROM erststimmenProParteiProWahlkreis ks 
    FULL OUTER JOIN zweitstimmenProParteiProWahlkreis zs ON ks.parteiid = zs.parteiid and ks.wahlkreisid = zs.wahlkreisid 
);

---------------------------------------------------------

CREATE MATERIALIZED VIEW erststimmenProPartei as (
    SELECT ks.parteiid, ks.parteiname, ks.datum, sum(ks.anzahlStimmen) as anzahlStimmen
    FROM erststimmenProParteiProWahlkreis ks
    GROUP BY ks.parteiid, ks.parteiname, ks.datum
);

CREATE MATERIALIZED VIEW zweitstimmenProPartei as (
    SELECT zs.parteiid, zs.parteiname, zs.datum, sum(zs.anzahlStimmen) as anzahlStimmen
    FROM zweitStimmenProParteiProWahlkreis zs
    GROUP BY zs.parteiid, zs.parteiname, zs.datum
);

CREATE MATERIALIZED VIEW gesamtstimmenProPartei as (
    SELECT COALESCE(ks.parteiid, zs.parteiid) as parteiid, 
            COALESCE(ks.parteiname, zs.parteiname) as parteiname, 
             COALESCE(ks.datum, zs.datum) as datum, 
              COALESCE(ks.anzahlStimmen, 0) + COALESCE(zs.anzahlStimmen, 0) as anzahlStimmen
    FROM erststimmenProPartei ks
    FULL OUTER JOIN zweitstimmenProPartei zs ON ks.parteiid = zs.parteiid
);
--------------------------------------------------

CREATE MATERIALIZED VIEW erststimmenProStimmkreis as (
    SELECT ks.stimmkreisid, ks.datum, sum(ks.anzahlStimmen) as anzahlStimmen
    FROM kandidiert_erststimmen ks
    GROUP BY ks.stimmkreisid, ks.datum
);

CREATE MATERIALIZED VIEW zweitstimmenProStimmkreis as (
    SELECT zs.stimmkreisid, zs.datum, sum(zs.anzahlStimmen) as anzahlStimmen
    FROM kandidiert_zweitstimmen zs
    GROUP BY zs.stimmkreisid, zs.datum
);

CREATE MATERIALIZED VIEW gesamtstimmenProStimmkreis as (
    SELECT COALESCE(ks.stimmkreisid, zs.stimmkreisid) as stimmkreisid, 
            COALESCE(ks.datum, zs.datum) as datum,
                COALESCE(ks.anzahlStimmen, 0) + COALESCE(zs.anzahlStimmen, 0) as anzahlStimmen
    FROM erststimmenProStimmkreis ks
    FULL OUTER JOIN zweitstimmenProStimmkreis zs ON ks.stimmkreisid = zs.stimmkreisid
);

-------Q3-------------------
CREATE MATERIALIZED VIEW wahlbeteiligungProStimmkreis as (
    SELECT (wh.anzahlWaehler * 1.00)/wb.anzahlWahlberechtigte as beteiligung, wb.datum, wb.stimmkreisid
    FROM anzahlWahlberechtigte wb, anzahlWaehler wh
        WHERE wb.stimmkreisid =  wh.stimmkreisid
);




----------------------------

/*CREATE MATERIALIZED VIEW waehlerProWahlkreis as (
    SELECT s.wahlkreisid, a.datum, sum(a.anzahlwaehler) as waehler
    FROM anzahlWaehler a, stimmkreise s
        WHERE a.stimmkreisid = s.stimmkreisid
    GROUP BY s.wahlkreisid, a.datum
);

CREATE MATERIALIZED VIEW gesamtstimmen as (
    SELECT gs.datum, SUM(gs.anzahlStimmen) as anzahlStimmen
    FROM gesamtStimmenProPartei gs
    GROUP BY gs.datum
);*/