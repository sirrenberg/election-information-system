// src/routes/users.ts
import express from "express";
import pool from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    console.log(req.query);

    const stimmkreisid: string = req.query.id as string;
    const dateCurrentElection: string = req.query
      .date_current_election as string;
    const datePrevElection: string = req.query.date_prev_election as string;
    if (
      stimmkreisid === undefined ||
      dateCurrentElection === undefined ||
      datePrevElection === undefined
    ) {
      res.status(400).send("Bad Request");
      return;
    } else if (
      !(
        /^\d+$/.test(stimmkreisid) &&
        /^\d{4}-\d{2}-\d{2}$/.test(dateCurrentElection) &&
        /^\d{4}-\d{2}-\d{2}$/.test(datePrevElection)
      )
    ) {
      res.status(400).send("Bad Request");
      return;
    }
    const { rows: direktkandidat } = await pool.query(
      `
    WITH 
    winnerErststimmen AS (
    SELECT
        k1.datum,
        wps.beteiligung AS beteiligung,
        kand.kandidatennamen,
        p.kurzbezeichnung,
        k1.anzahlstimmen,
        wps.anzahlWaehler, 
        wps.anzahlStimmberechtigte,
        s.name AS stimmkreisname
    FROM
        kandidiert_erststimmen k1
        JOIN kandidaten kand ON kand.kandidatenid = k1.kandidatenid
        JOIN wahlbeteiligungProStimmkreis wps ON wps.datum = k1.datum AND wps.stimmkreisid = k1.stimmkreisid
        JOIN parteien p ON p.parteiid = kand.parteiid
        JOIN stimmkreise s ON s.stimmkreisid = k1.stimmkreisid
    WHERE
        k1.stimmkreisid = ${stimmkreisid}
        AND
        (k1.datum = '${dateCurrentElection}' OR k1.datum = '${datePrevElection}')
        AND
        NOT EXISTS (
          SELECT 1
          FROM kandidiert_erststimmen k2
          WHERE k2.datum = k1.datum AND k2.anzahlstimmen > k1.anzahlstimmen AND k2.stimmkreisid = k1.stimmkreisid
        )
    )
    SELECT 
        w1.*,
        (w1.beteiligung - w2.beteiligung) AS diffBeteiligung,
        w2.kandidatennamen AS letzterDirektkandidat,
        w2.kurzbezeichnung AS parteiLetzterDirektkandidat,
        (w1.anzahlstimmen - w2.anzahlstimmen) AS diffStimmen,
        (w1.anzahlWaehler - w2.anzahlWaehler) AS diffWaehler,
        (w1.anzahlStimmberechtigte - w2.anzahlStimmberechtigte) AS diffStimmberechtigte
    FROM 
        winnerErststimmen w1,winnerErststimmen w2
    WHERE
        w1.datum = '${dateCurrentElection}' AND w2.datum = '${datePrevElection}'
    `
    );

    const { rows: anzStimmen } = await pool.query(
      `
    WITH stimmenFürParteien AS(
      SELECT g.parteiname, g.kurzbezeichnung, g.farbe, g.anzahlstimmen, p.prozentualstimmen, g.datum
        FROM 
          gesamtStimmenProParteiProStimmkreis g
          JOIN pgesamtStimmenProParteiProStimmkreis p 
          ON g.parteiid = p.parteiid AND p.datum = g.datum AND p.stimmkreisid = g.stimmkreisid
        WHERE g.stimmkreisid = ${stimmkreisid} AND (g.datum = '${dateCurrentElection}' OR g.datum = '${datePrevElection}')
    )
    
    SELECT 
      coalesce(s1.parteiname,s2.parteiname) AS parteiname,
      coalesce(s1.kurzbezeichnung,s2.kurzbezeichnung) AS kurzbezeichnung,
      coalesce(s1.farbe,s2.farbe) AS farbe,
      coalesce(s1.anzahlstimmen,0) AS anzahlstimmen,
      coalesce(s1.prozentualstimmen,0) AS prozentualstimmen,
      coalesce(s1.anzahlstimmen,0) - coalesce(s2.anzahlstimmen,0) AS diffStimmenAbsolut,
      coalesce(s1.prozentualstimmen,0) - coalesce(s2.prozentualstimmen,0) AS diffStimmenRel
    FROM 
      (SELECT * FROM stimmenFürParteien WHERE datum = '${dateCurrentElection}') s1
      FULL OUTER JOIN
      (SELECT * FROM stimmenFürParteien WHERE datum = '${datePrevElection}') s2
      ON s1.kurzbezeichnung = s2.kurzbezeichnung
    ORDER BY anzahlstimmen DESC
    `
    );

    const { rows: stimmkreissieger } = await pool.query(
      `
      SELECT 
        erststimmenSieger.kurzbezeichnung AS erststimmenSiegerPartei,
        erststimmenSieger.anzahlstimmen AS erststimmenSiegerStimmen,
        zweitstimmenSieger.kurzbezeichnung AS zweitstimmenSiegerPartei,
        zweitstimmenSieger.anzahlstimmen AS zweitstimmenSiegerStimmen,
        gesamtstimmenSieger.kurzbezeichnung AS gesamtstimmenSiegerPartei,
        gesamtstimmenSieger.anzahlstimmen AS gesamtstimmenSiegerStimmen
      FROM 
        (SELECT kurzbezeichnung, anzahlstimmen FROM erststimmenSiegerStimmkreis WHERE stimmkreisid = ${stimmkreisid}) erststimmenSieger,
        (SELECT kurzbezeichnung, anzahlstimmen FROM zweitStimmenSiegerStimmkreis WHERE stimmkreisid = ${stimmkreisid}) zweitstimmenSieger,
        (SELECT kurzbezeichnung, anzahlstimmen FROM gesammtStimmenSiegerStimmkreis WHERE stimmkreisid = ${stimmkreisid}) gesamtstimmenSieger
	

      `
    );
    res.json({
      direktkandidat: direktkandidat,
      stimmen: anzStimmen,
      stimmkreissieger: stimmkreissieger,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

router.get("/single_votes", async (req, res) => {
  try {
    const stimmkreisid: string = req.query.id as string;
    const dateCurrentElection: string = req.query
      .date_current_election as string;
    const datePrevElection: string = req.query.date_prev_election as string;
    if (
      stimmkreisid === undefined ||
      dateCurrentElection === undefined ||
      datePrevElection === undefined
    ) {
      res.status(400).send("Bad Request");
      return;
    } else if (
      !(
        /^\d+$/.test(stimmkreisid) &&
        /^\d{4}-\d{2}-\d{2}$/.test(dateCurrentElection) &&
        /^\d{4}-\d{2}-\d{2}$/.test(datePrevElection)
      )
    ) {
      res.status(400).send("Bad Request");
      return;
    }

    console.log("directkandidat");

    const { rows: direktkandidat } = await pool.query(
      `
      WITH 
      erststimmenProStimmkreisSingle as (
        SELECT ks.stimmkreisid, ks.datum, count(*) as anzahlStimmen
        FROM erststimmen ks
        GROUP BY ks.stimmkreisid, ks.datum
    ),
      zweitstimmenProStimmkreisSingle as (
        SELECT zs.stimmkreisid, zs.datum, count(*) as anzahlStimmen
        FROM zweitstimmen zs
        GROUP BY zs.stimmkreisid, zs.datum
    ),
      gesamtstimmenProStimmkreisSingle as (
        SELECT COALESCE(ks.stimmkreisid, zs.stimmkreisid) as stimmkreisid, 
                COALESCE(ks.datum, zs.datum) as datum,
                    COALESCE(ks.anzahlStimmen, 0) + COALESCE(zs.anzahlStimmen, 0) as anzahlStimmen
        FROM erststimmenProStimmkreisSingle ks
        FULL OUTER JOIN zweitstimmenProStimmkreisSingle zs ON ks.stimmkreisid = zs.stimmkreisid AND ks.datum = zs.datum
    ),  

    wahlbeteiligungProStimmkreisSingle AS (
      SELECT ((anzahlStimmen/2.0) / (asw.anzahlStimmberechtigte) * 100.0) as beteiligung, gs.stimmkreisid, gs.datum
      FROM gesamtstimmenProStimmkreisSingle gs, anzahlStimmberechtigteUndWaehler asw
      WHERE gs.stimmkreisid = asw.stimmkreisid AND gs.datum = asw.datum
  ),

  votesProCandidateInStimmkreisSingle AS (
    SELECT k.kandidatenid, k.stimmkreisid, k.datum, count(*) as anzahlstimmen
    FROM erststimmen k
    GROUP BY k.kandidatenid, k.stimmkreisid, k.datum
  ),

    winnerErststimmen AS (
    SELECT
        k1.datum,
        wps.beteiligung AS beteiligung,
        kand.kandidatennamen,
        p.kurzbezeichnung,
        k1.anzahlstimmen,
        s.name AS stimmkreisname
    FROM
    votesProCandidateInStimmkreisSingle k1
        JOIN kandidaten kand ON kand.kandidatenid = k1.kandidatenid
        JOIN wahlbeteiligungProStimmkreisSingle wps ON wps.datum = k1.datum AND wps.stimmkreisid = k1.stimmkreisid
        JOIN parteien p ON p.parteiid = kand.parteiid
        JOIN stimmkreise s ON s.stimmkreisid = k1.stimmkreisid
    WHERE
        k1.stimmkreisid = ${stimmkreisid}
        AND
        (k1.datum = '${dateCurrentElection}' OR k1.datum = '${datePrevElection}')
        AND
        NOT EXISTS (
          SELECT 1
          FROM votesProCandidateInStimmkreisSingle k2
          WHERE k2.datum = k1.datum AND k2.anzahlstimmen > k1.anzahlstimmen AND k2.stimmkreisid = k1.stimmkreisid
        )
    )
    SELECT 
        w1.*,
        (w1.beteiligung - w2.beteiligung) AS diffBeteiligung,
        w2.kandidatennamen AS letzterDirektkandidat,
        w2.kurzbezeichnung AS parteiLetzterDirektkandidat,
        (w1.anzahlstimmen - w2.anzahlstimmen) AS diffStimmen
    FROM 
        winnerErststimmen w1,winnerErststimmen w2
    WHERE
        w1.datum = '${dateCurrentElection}' AND w2.datum = '${datePrevElection}'
    `
    );

    console.log("anzStimmen");

    const { rows: anzStimmen } = await pool.query(
      `
      WITH generated_kandidiert_erststimmen AS(
        SELECT e.kandidatenid, e.stimmkreisid, e.datum, count(e.*) AS anzahlStimmen
        FROM erststimmen e
        GROUP BY e.kandidatenid, e.stimmkreisid, e.datum
      ),
      generated_kandidiert_zweitstimmen AS(
        SELECT z.kandidatenid, z.stimmkreisid, z.datum, count(z.*) AS anzahlStimmen
        FROM zweitstimmen z
        GROUP BY z.kandidatenid, z.stimmkreisid, z.datum 
      ),
      generated_erststimmenProParteiProStimmkreis as (
          SELECT p.parteiid, p.parteiname, p.kurzbezeichnung, p.farbe, ks.datum, ks.stimmkreisid, sum(ks.anzahlStimmen) as anzahlstimmen
          FROM generated_kandidiert_erststimmen ks, kandidaten k, parteien p 
              WHERE ks.kandidatenid = k.kandidatenid and k.parteiid = p.parteiid
          GROUP BY p.parteiid, p.parteiname, p.kurzbezeichnung, p.farbe, ks.datum, ks.stimmkreisid
      ),
      generated_zweitstimmenProParteiProStimmkreis as (
          SELECT p.parteiid, p.parteiname, p.kurzbezeichnung, p.farbe, zs.datum, zs.stimmkreisid, sum(zs.anzahlStimmen) as anzahlstimmen
          FROM generated_kandidiert_zweitstimmen zs, kandidaten k, parteien p
              WHERE zs.kandidatenid = k.kandidatenid and k.parteiid = p.parteiid
          GROUP BY p.parteiid, p.parteiname, p.kurzbezeichnung, p.farbe, zs.datum, zs.stimmkreisid
      ),
      generated_gesamtStimmenProParteiProStimmkreis AS (
          SELECT COALESCE(ks.parteiid, zs.parteiid) as parteiid, 
                  COALESCE(ks.parteiname, zs.parteiname) as parteiname,
                   COALESCE(ks.kurzbezeichnung, zs.kurzbezeichnung) as kurzbezeichnung,
                    COALESCE(ks.farbe, zs.farbe) as farbe,
                    COALESCE(ks.datum, zs.datum) as datum,
                    COALESCE(ks.stimmkreisid, zs.stimmkreisid) as stimmkreisid,
                     COALESCE(ks.anzahlStimmen, 0) + COALESCE(zs.anzahlStimmen, 0) as anzahlStimmen
          FROM generated_erststimmenProParteiProStimmkreis ks 
          FULL OUTER JOIN generated_zweitstimmenProParteiProStimmkreis zs 
                              ON ks.parteiid = zs.parteiid AND ks.stimmkreisid=zs.stimmkreisid AND ks.datum=zs.datum  
      ),
      generated_erststimmenProStimmkreis as (
          SELECT ks.stimmkreisid, ks.datum, sum(ks.anzahlStimmen) as anzahlStimmen
          FROM generated_kandidiert_erststimmen ks
          GROUP BY ks.stimmkreisid, ks.datum
      ),
      generated_zweitstimmenProStimmkreis as (
          SELECT zs.stimmkreisid, zs.datum, sum(zs.anzahlStimmen) as anzahlStimmen
          FROM generated_kandidiert_zweitstimmen zs
          GROUP BY zs.stimmkreisid, zs.datum
      ),
      generated_gesamtstimmenProStimmkreis as (
          SELECT COALESCE(ks.stimmkreisid, zs.stimmkreisid) as stimmkreisid, 
                  COALESCE(ks.datum, zs.datum) as datum,
                      COALESCE(ks.anzahlStimmen, 0) + COALESCE(zs.anzahlStimmen, 0) as anzahlStimmen
          FROM generated_erststimmenProStimmkreis ks
          FULL OUTER JOIN generated_zweitstimmenProStimmkreis zs ON ks.stimmkreisid = zs.stimmkreisid AND ks.datum = zs.datum
      ),
      generated_pgesamtStimmenProParteiProStimmkreis as (
          SELECT gsp.parteiid, gsp.parteiname,
                   gsp.kurzbezeichnung, gsp.farbe, 
                      gsp.datum, gsp.stimmkreisid,
                          (gsp.anzahlStimmen * 1.00) / gs.anzahlStimmen  as prozentualStimmen
          FROM generated_gesamtstimmenProStimmkreis gs, generated_gesamtStimmenProParteiProStimmkreis gsp 
          WHERE gs.stimmkreisid = gsp.stimmkreisid AND gs.datum = gsp.datum 
      ),
      generated_stimmenFürParteien AS(
            SELECT g.parteiname, g.kurzbezeichnung, g.farbe, g.anzahlstimmen, p.prozentualstimmen, g.datum
              FROM 
                generated_gesamtStimmenProParteiProStimmkreis g
                JOIN generated_pgesamtStimmenProParteiProStimmkreis p 
                ON g.parteiid = p.parteiid AND p.datum = g.datum AND p.stimmkreisid = g.stimmkreisid
              WHERE g.stimmkreisid = ${stimmkreisid} AND (g.datum = '${dateCurrentElection}' OR g.datum = '${datePrevElection}')
      )
      SELECT 
         coalesce(s1.parteiname,s2.parteiname) AS parteiname,
         coalesce(s1.kurzbezeichnung,s2.kurzbezeichnung) AS kurzbezeichnung,
         coalesce(s1.farbe,s2.farbe) AS farbe,
         coalesce(s1.anzahlstimmen,0) AS anzahlstimmen,
         coalesce(s1.prozentualstimmen,0) AS prozentualstimmen,
         coalesce(s1.anzahlstimmen,0) - coalesce(s2.anzahlstimmen,0) AS diffStimmenAbsolut,
         coalesce(s1.prozentualstimmen,0) - coalesce(s2.prozentualstimmen,0) AS diffStimmenRel
      FROM 
         (SELECT * FROM generated_stimmenFürParteien WHERE datum = '${dateCurrentElection}') s1
         FULL OUTER JOIN
         (SELECT * FROM generated_stimmenFürParteien WHERE datum = '${datePrevElection}') s2
         ON s1.kurzbezeichnung = s2.kurzbezeichnung
      ORDER BY anzahlstimmen DESC      
    `
    );

    console.log("stimmkreissieger");

    const { rows: stimmkreissieger } = await pool.query(
      `
      WITH generated_kandidiert_erststimmen AS(
        SELECT e.kandidatenid, e.stimmkreisid, e.datum, count(e.*) AS anzahlStimmen
        FROM erststimmen e
        GROUP BY e.kandidatenid, e.stimmkreisid, e.datum
      ),
      generated_kandidiert_zweitstimmen AS(
        SELECT z.kandidatenid, z.stimmkreisid, z.datum, count(z.*) AS anzahlStimmen
        FROM zweitstimmen z
        GROUP BY z.kandidatenid, z.stimmkreisid, z.datum 
      ),
      generated_erststimmenSiegerStimmkreis as (
        SELECT
          k.parteiid,
          p.kurzbezeichnung,
          k1.stimmkreisid,
          k1.anzahlstimmen
        FROM
          generated_kandidiert_erststimmen k1
          INNER JOIN
          kandidaten k
          ON
          k.kandidatenid = k1.kandidatenid
          INNER JOIN parteien p
          ON p.parteiid = k.parteiid
        WHERE
          NOT EXISTS (
          SELECT 1
          FROM generated_kandidiert_erststimmen k2
          WHERE 
            k2.anzahlstimmen > k1.anzahlstimmen 
            AND k2.stimmkreisid = k1.stimmkreisid 
            AND k1.datum = k2.datum
          )
          AND
          k1.datum = '2023-10-08'
        ),
      generated_sumZweitstimmenStimmkreis AS (
        SELECT kz.datum, p.parteiid, p.kurzbezeichnung, stimmkreisid, sum(anzahlstimmen) AS anzahlstimmen
        FROM 
          generated_kandidiert_zweitstimmen kz
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
        ),
        generated_zweitStimmenSiegerStimmkreis AS (
          SELECT
            szs1.parteiid,
            szs1.stimmkreisid,
            szs1.anzahlstimmen,
            szs1.kurzbezeichnung
          FROM
            generated_sumZweitstimmenStimmkreis szs1
          WHERE
            NOT EXISTS (
              SELECT 1
              FROM generated_sumZweitstimmenStimmkreis szs2
              WHERE 
                szs2.anzahlstimmen > szs1.anzahlstimmen 
                AND szs2.stimmkreisid = szs1.stimmkreisid
            )
        ),
      generated_summeGesammtstimmenStimmkreis AS(
          SELECT 
            (ke.anzahlstimmen + szs.anzahlstimmen) AS anzahlstimmen, 
            szs.parteiid, 
            szs.kurzbezeichnung,
            szs.stimmkreisid
          FROM
            generated_kandidiert_erststimmen ke
            INNER JOIN kandidaten k ON ke.kandidatenid = k.kandidatenid
            INNER JOIN generated_sumZweitstimmenStimmkreis szs
            ON szs.stimmkreisid = ke.stimmkreisid AND k.parteiid = szs.parteiid AND ke.datum = szs.datum
          WHERE
            ke.datum = '2023-10-08'	
      ),
      generated_gesammtStimmenSiegerStimmkreis AS (
        SELECT
          sgs1.parteiid,
          sgs1.stimmkreisid,
          sgs1.anzahlstimmen,
          sgs1.kurzbezeichnung
        FROM
          generated_summeGesammtstimmenStimmkreis sgs1
        WHERE
          NOT EXISTS (
          SELECT 1
          FROM generated_summeGesammtstimmenStimmkreis sgs2
          WHERE 
            sgs2.anzahlstimmen > sgs1.anzahlstimmen 
            AND sgs2.stimmkreisid = sgs1.stimmkreisid
          )
        )
      SELECT 
        erststimmenSieger.kurzbezeichnung AS erststimmenSiegerPartei,
        erststimmenSieger.anzahlstimmen AS erststimmenSiegerStimmen,
        zweitstimmenSieger.kurzbezeichnung AS zweitstimmenSiegerPartei,
        zweitstimmenSieger.anzahlstimmen AS zweitstimmenSiegerStimmen,
        gesamtstimmenSieger.kurzbezeichnung AS gesamtstimmenSiegerPartei,
        gesamtstimmenSieger.anzahlstimmen AS gesamtstimmenSiegerStimmen
      FROM 
        (SELECT kurzbezeichnung, anzahlstimmen FROM generated_erststimmenSiegerStimmkreis WHERE stimmkreisid = ${stimmkreisid}) erststimmenSieger,
        (SELECT kurzbezeichnung, anzahlstimmen FROM generated_zweitStimmenSiegerStimmkreis WHERE stimmkreisid = ${stimmkreisid}) zweitstimmenSieger,
        (SELECT kurzbezeichnung, anzahlstimmen FROM generated_gesammtStimmenSiegerStimmkreis WHERE stimmkreisid = ${stimmkreisid}) gesamtstimmenSieger
      `
    );
    res.json({
      direktkandidat: direktkandidat,
      stimmen: anzStimmen,
      stimmkreissieger: stimmkreissieger,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

export default router;
