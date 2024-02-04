DROP MATERIALIZED VIEW IF EXISTS erststimmenProKandidatProWahlkreis CASCADE;
DROP MATERIALIZED VIEW IF EXISTS zweitstimmenProKandidatProWahlkreis CASCADE;
DROP MATERIALIZED VIEW IF EXISTS gesamtStimmenProKandidatProWahlkreis CASCADE;
DROP MATERIALIZED VIEW IF EXISTS erststimmenProParteiProWahlkreis CASCADE;
DROP MATERIALIZED VIEW IF EXISTS zweitstimmenProParteiProWahlkreis CASCADE;
DROP MATERIALIZED VIEW IF EXISTS gesamtStimmenProParteiProWahlkreis CASCADE;
DROP MATERIALIZED VIEW IF EXISTS erststimmenProPartei CASCADE;
DROP MATERIALIZED VIEW IF EXISTS zweitstimmenProPartei CASCADE;
DROP MATERIALIZED VIEW IF EXISTS gesamtstimmenProPartei CASCADE;
DROP MATERIALIZED VIEW IF EXISTS erststimmenProStimmkreis CASCADE;
DROP MATERIALIZED VIEW IF EXISTS zweitstimmenProStimmkreis CASCADE;
DROP MATERIALIZED VIEW IF EXISTS gesamtstimmenProStimmkreis CASCADE;
DROP MATERIALIZED VIEW IF EXISTS wahlbeteiligungProStimmkreis CASCADE;
DROP MATERIALIZED VIEW IF EXISTS erststimmenProParteiProStimmkreis CASCADE;
DROP MATERIALIZED VIEW IF EXISTS zweitstimmenProParteiProStimmkreis CASCADE;
DROP MATERIALIZED VIEW IF EXISTS gesamtStimmenProParteiProStimmkreis CASCADE;
DROP MATERIALIZED VIEW IF EXISTS pgesamtStimmenProParteiProStimmkreis CASCADE;
DROP MATERIALIZED VIEW IF EXISTS stimmenUnterschiedProParteiProStimmkreis CASCADE;
DROP MATERIALIZED VIEW IF EXISTS erststimmenSiegerStimmkreis CASCADE;
DROP MATERIALIZED VIEW IF EXISTS sumZweitstimmenStimmkreis CASCADE;
DROP MATERIALIZED VIEW IF EXISTS zweitStimmenSiegerStimmkreis CASCADE;
DROP MATERIALIZED VIEW IF EXISTS summeGesammtstimmenStimmkreis CASCADE;
DROP MATERIALIZED VIEW IF EXISTS gesammtStimmenSiegerStimmkreis CASCADE;

CREATE MATERIALIZED VIEW erststimmenProKandidatProWahlkreis as (
    SELECT ks.kandidatenid, ks.datum, s.wahlkreisid, sum(ks.anzahlStimmen) as anzahlStimmen
    FROM kandidiert_erststimmen ks, stimmkreise s
        WHERE ks.stimmkreisid = s.stimmkreisid AND ks.datum = '2023-10-08'
    GROUP BY ks.kandidatenid, ks.datum, s.wahlkreisid
);

CREATE MATERIALIZED VIEW zweitstimmenProKandidatProWahlkreis as (
    SELECT zs.kandidatenid, zs.datum, s.wahlkreisid, sum(zs.anzahlStimmen) as anzahlStimmen
    FROM kandidiert_zweitstimmen zs, stimmkreise s
        WHERE zs.stimmkreisid = s.stimmkreisid AND zs.datum = '2023-10-08'
    GROUP BY zs.kandidatenid, zs.datum, s.wahlkreisid
);

CREATE MATERIALIZED VIEW gesamtStimmenProKandidatProWahlkreis as (
    SELECT COALESCE(ks.kandidatenid, zs.kandidatenid) as kandidatenid,
            COALESCE(ks.datum, zs.datum) as datum,
                COALESCE(ks.wahlkreisid, zs.wahlkreisid) as wahlkreisid,
                 (COALESCE(ks.anzahlStimmen, 0) + COALESCE(zs.anzahlStimmen, 0)) as anzahlStimmen
    FROM erststimmenProKandidatProWahlkreis ks 
    FULL OUTER JOIN zweitstimmenProKandidatProWahlkreis zs ON ks.kandidatenid = zs.kandidatenid and ks.wahlkreisid = zs.wahlkreisid 
);

CREATE MATERIALIZED VIEW erststimmenProParteiProWahlkreis as (
    SELECT p.parteiid, p.parteiname, p.kurzbezeichnung, p.farbe, ks.datum, ks.wahlkreisid, sum(ks.anzahlStimmen) as anzahlStimmen
    FROM erststimmenProKandidatProWahlkreis ks, kandidaten k, parteien p
    WHERE ks.kandidatenid = k.kandidatenid AND k.parteiid = p.parteiid
    GROUP BY p.parteiid, p.parteiname, p.kurzbezeichnung, p.farbe, ks.datum, ks.wahlkreisid
);

CREATE MATERIALIZED VIEW zweitstimmenProParteiProWahlkreis as (
    SELECT p.parteiid, p.parteiname, p.kurzbezeichnung, p.farbe, zs.datum, zs.wahlkreisid, sum(zs.anzahlStimmen) as anzahlStimmen
    FROM zweitstimmenProKandidatProWahlkreis zs, kandidaten k, parteien p
    WHERE zs.kandidatenid = k.kandidatenid AND k.parteiid = p.parteiid
    GROUP BY p.parteiid, p.parteiname, p.kurzbezeichnung, p.farbe, zs.datum, zs.wahlkreisid
);

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
CREATE MATERIALIZED VIEW wahlbeteiligungProStimmkreis AS (
    SELECT ((sub.anzahlWaehler * 1.00)/sub.anzahlStimmberechtigte) AS beteiligung, sub.datum, sub.stimmkreisid, sub.anzahlWaehler, sub.anzahlStimmberechtigte
    FROM anzahlStimmberechtigteUndWaehler sub
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


-------- (Q4 Gesammtstimmen) ------------------

-- die Kandidaten, die ihren Stimmkreis gewonnen haben
CREATE MATERIALIZED VIEW erststimmenSiegerStimmkreis as (
		SELECT
			k.parteiid,
			p.kurzbezeichnung,
			k1.stimmkreisid,
			k1.anzahlstimmen
		FROM
			kandidiert_erststimmen k1
			INNER JOIN
			kandidaten k
			ON
			k.kandidatenid = k1.kandidatenid
			INNER JOIN parteien p
			ON p.parteiid = k.parteiid
		WHERE
			NOT EXISTS (
				SELECT 1
				FROM kandidiert_erststimmen k2
				WHERE 
					k2.anzahlstimmen > k1.anzahlstimmen 
					AND k2.stimmkreisid = k1.stimmkreisid 
					AND k1.datum = k2.datum
			)
			AND
				k1.datum = '2023-10-08'
	);

    --summe Zweitstimmen pro Partei pro Stimmkreis
CREATE MATERIALIZED VIEW sumZweitstimmenStimmkreis AS (
		SELECT kz.datum, p.parteiid, p.kurzbezeichnung, stimmkreisid, sum(anzahlstimmen) AS anzahlstimmen
		FROM 
			kandidiert_zweitstimmen kz
			JOIN
			kandidaten k
			ON kz.kandidatenid = k.kandidatenid
			JOIN
			parteien p
			ON k.parteiid = p.parteiid
		WHERE
			kz.datum = '2023-10-08'
		GROUP BY p.parteiid, stimmkreisid, kz.datum
		ORDER BY stimmkreisid
	);

CREATE MATERIALIZED VIEW zweitStimmenSiegerStimmkreis AS (
		SELECT
			szs1.parteiid,
			szs1.stimmkreisid,
			szs1.anzahlstimmen,
			szs1.kurzbezeichnung
		FROM
			sumZweitstimmenStimmkreis szs1
		WHERE
			NOT EXISTS (
				SELECT 1
				FROM sumZweitstimmenStimmkreis szs2
				WHERE 
					szs2.anzahlstimmen > szs1.anzahlstimmen 
					AND szs2.stimmkreisid = szs1.stimmkreisid
			)
	);

	--summe Gesammtstimmen pro Partei pro Stimmkreis
CREATE MATERIALIZED VIEW summeGesammtstimmenStimmkreis AS(
		SELECT 
			(ke.anzahlstimmen + szs.anzahlstimmen) AS anzahlstimmen, 
			szs.parteiid, 
			szs.kurzbezeichnung,
			szs.stimmkreisid
		FROM
			kandidiert_erststimmen ke
			INNER JOIN kandidaten k ON ke.kandidatenid = k.kandidatenid
			INNER JOIN sumZweitstimmenStimmkreis szs
			ON szs.stimmkreisid = ke.stimmkreisid AND k.parteiid = szs.parteiid AND ke.datum = szs.datum
		WHERE
			ke.datum = '2023-10-08'	
	);

CREATE MATERIALIZED VIEW gesammtStimmenSiegerStimmkreis AS (
		SELECT
			sgs1.parteiid,
			sgs1.stimmkreisid,
			sgs1.anzahlstimmen,
			sgs1.kurzbezeichnung
		FROM
			summeGesammtstimmenStimmkreis sgs1
		WHERE
			NOT EXISTS (
				SELECT 1
				FROM summeGesammtstimmenStimmkreis sgs2
				WHERE 
					sgs2.anzahlstimmen > sgs1.anzahlstimmen 
					AND sgs2.stimmkreisid = sgs1.stimmkreisid
			)
	);

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