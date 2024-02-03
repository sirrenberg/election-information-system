// src/routes/users.ts
import express from "express";
import pool from "../db.js";

const router = express.Router();

function isPositiveWholeNumber(value: string): boolean {
  return /^\d+$/.test(value);
}

router.get("/", async (req, res) => {
  try {
    const stimmkreisid: string = req.query.stimmkreisid as string;
    const dateCurrentElection: string = req.query.date_current_election as string;
    const datePrevElection: string = req.query.date_prev_election as string;
    //const { date_current_election, date_prev_election, stimmkreisid } = req.query;
    // check that the parameters are in the correct format and prevent SQL injection
    if (stimmkreisid === undefined || dateCurrentElection === undefined || datePrevElection === undefined) {
      res.status(400).send("Bad Request");
      return;
    }
    else if(!(/^\d+$/.test(stimmkreisid) && /^\d{4}-\d{2}-\d{2}$/.test(dateCurrentElection) && /^\d{4}-\d{2}-\d{2}$/.test(datePrevElection))) {
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
    res.json({"direktkandidat": direktkandidat, "stimmen" : anzStimmen});
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

export default router;
