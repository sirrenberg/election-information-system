// src/routes/users.ts
import express from "express";
import pool from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
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
      k1.stimmkreisid = 402
      AND
      (k1.datum = '2023-10-08' OR k1.datum = '2018-10-14')
      AND
      NOT EXISTS (
      SELECT 1
      FROM kandidiert_erststimmen k2
      WHERE k2.datum = k1.datum AND k2.anzahlstimmen > k1.anzahlstimmen AND k2.stimmkreisid = k1.stimmkreisid
      )
    )
    
    SELECT *
    FROM winnerErststimmen
    `
  );

  const { rows: anzStimmen } = await pool.query(
    `
    SELECT g.parteiname, g.kurzbezeichnung, g.farbe, g.anzahlstimmen, p.prozentualstimmen, g.datum
    FROM 
      gesamtStimmenProParteiProStimmkreis g
      JOIN pgesamtStimmenProParteiProStimmkreis p 
      ON g.parteiid = p.parteiid AND p.datum = g.datum AND p.stimmkreisid = g.stimmkreisid
    WHERE g.stimmkreisid = 402 AND (g.datum = '2023-10-08' OR g.datum = '2018-10-14')
    ORDER BY g.datum, g.anzahlstimmen DESC
    `
    );
    res.json({"direktkandidat": direktkandidat, "stimmen" : anzStimmen});
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

export default router;
