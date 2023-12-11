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
            COALESCE(ks.kurzbezeichnung, zs.kurzbezeichnung) as kurzbezeichnung,
            COALESCE(ks.farbe, zs.farbe) as farbe,
            COALESCE(ks.datum, zs.datum) as datum,
                COALESCE(ks.wahlkreisid, zs.wahlkreisid) as wahlkreisid,
                 (COALESCE(ks.anzahlStimmen, 0) + COALESCE(zs.anzahlStimmen, 0)) as anzahlStimmen
    FROM erststimmenProParteiProWahlkreis ks 
    FULL OUTER JOIN zweitstimmenProParteiProWahlkreis zs ON ks.parteiid = zs.parteiid and ks.wahlkreisid = zs.wahlkreisid 
);

---------------------------------------------------------
--This all pro Wahlkreis
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
    FULL OUTER JOIN zweitstimmenProStimmkreis zs ON ks.stimmkreisid = zs.stimmkreisid AND ks.datum = zs.datum
);

-------Q3.1-------------------
CREATE MATERIALIZED VIEW wahlbeteiligungProStimmkreis as (
    SELECT ((wh.anzahlWaehler * 1.00)/wb.anzahlWahlberechtigte) as beteiligung, wb.datum, wb.stimmkreisid
    FROM anzahlWahlberechtigte wb, anzahlWaehler wh
        WHERE wb.stimmkreisid =  wh.stimmkreisid AND wb.datum=wh.datum
);

-----------------------------

-------- Q3.2/3/4 ---------------
CREATE MATERIALIZED VIEW erststimmenProParteiProStimmkreis as (
    SELECT p.parteiid, p.parteiname, p.kurzbezeichnung, p.farbe, ks.datum, ks.stimmkreisid, sum(ks.anzahlStimmen) as anzahlstimmen
    FROM kandidiert_erststimmen ks, kandidaten k, parteien p 
        WHERE ks.kandidatenid = k.kandidatenid and k.parteiid = p.parteiid
    GROUP BY p.parteiid, p.parteiname, p.kurzbezeichnung, p.farbe, ks.datum, ks.stimmkreisid
);

CREATE MATERIALIZED VIEW zweitstimmenProParteiProStimmkreis as (
    SELECT p.parteiid, p.parteiname, p.kurzbezeichnung, p.farbe, zs.datum, zs.stimmkreisid, sum(zs.anzahlStimmen) as anzahlstimmen
    FROM kandidiert_zweitstimmen zs, kandidaten k, parteien p
        WHERE zs.kandidatenid = k.kandidatenid and k.parteiid = p.parteiid
    GROUP BY p.parteiid, p.parteiname, p.kurzbezeichnung, p.farbe, zs.datum, zs.stimmkreisid
);

---------Absoluter Anzahl von Gesamtstimmen---------------
CREATE MATERIALIZED VIEW gesamtStimmenProParteiProStimmkreis as (
    SELECT COALESCE(ks.parteiid, zs.parteiid) as parteiid, 
            COALESCE(ks.parteiname, zs.parteiname) as parteiname,
             COALESCE(ks.kurzbezeichnung, zs.kurzbezeichnung) as kurzbezeichnung,
              COALESCE(ks.farbe, zs.farbe) as farbe,
              COALESCE(ks.datum, zs.datum) as datum,
              COALESCE(ks.stimmkreisid, zs.stimmkreisid) as stimmkreisid,
               COALESCE(ks.anzahlStimmen, 0) + COALESCE(zs.anzahlStimmen, 0) as anzahlStimmen
    FROM erststimmenProParteiProStimmkreis ks 
    FULL OUTER JOIN zweitstimmenProParteiProStimmkreis zs 
                        ON ks.parteiid = zs.parteiid AND ks.stimmkreisid=zs.stimmkreisid AND ks.datum=zs.datum  
);

---------Prozentualer Anzahl von Gesamtstimmen-------------
CREATE MATERIALIZED VIEW pgesamtStimmenProParteiProStimmkreis as (
    SELECT gsp.parteiid, gsp.parteiname,
             gsp.kurzbezeichnung, gsp.farbe, 
                gsp.datum, gsp.stimmkreisid,
                    (gsp.anzahlStimmen * 1.00) / gs.anzahlStimmen  as prozentualStimmen
    FROM gesamtstimmenProStimmkreis gs, gesamtStimmenProParteiProStimmkreis gsp 
    WHERE gs.stimmkreisid = gsp.stimmkreisid AND gs.datum = gsp.datum 
);

-------- (2023-2018) Unterschied in Gesamtstimmen----------
CREATE MATERIALIZED VIEW stimmenUnterschiedProParteiProStimmkreis as (
    SELECT gsp1.parteiid, gsp1.parteiname,
            gsp1.kurzbezeichnung, gsp1.farbe, gsp1.stimmkreisid,
                (gsp1.anzahlStimmen - gsp2.anzahlStimmen) as stimmenUnterschied, 
                ((gsp1.anzahlStimmen - gsp2.anzahlStimmen) * 1.00) / gsp2.anzahlStimmen as relativUnterschied
    FROM gesamtStimmenProParteiProStimmkreis gsp1, gesamtStimmenProParteiProStimmkreis gsp2
        WHERE gsp1.parteiid = gsp2.parteiid AND gsp1.stimmkreisid=gsp2.stimmkreisid 
                                                AND gsp1.datum = '2023-10-08' AND gsp2.datum = '2018-10-14'
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