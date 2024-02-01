// src/routes/users.ts
import express from "express";
import pool from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { rows } = await pool.query(
    `
    WITH 
    winnerErststimmen AS (
    SELECT
      wps.beteiligung AS beteiligung,
      --k1.kandidatenid,
      kand.kandidatennamen,
      p.kurzbezeichnung,
      --k1.stimmkreisid,
      k1.anzahlstimmen
      --wps.anzahlWaehler, 
      --wps.anzahlStimmberechtigte
      
    FROM
      kandidiert_erststimmen k1
      JOIN kandidaten kand ON kand.kandidatenid = k1.kandidatenid
      JOIN wahlbeteiligungProStimmkreis wps ON wps.datum = k1.datum AND wps.stimmkreisid = k1.stimmkreisid
      JOIN parteien p ON p.parteiid = kand.parteiid
      --JOIN gesamtStimmenProParteiProStimmkreis gsppp ON gsppp.stimmkreisid = k1.stimmkreisid
    WHERE
      k1.stimmkreisid = 402
      AND
      k1.datum = '2023-10-08'
      AND
      NOT EXISTS (
      SELECT 1
      FROM kandidiert_erststimmen k2
      WHERE k2.datum = k1.datum AND k2.anzahlstimmen > k1.anzahlstimmen AND k2.stimmkreisid = k1.stimmkreisid
      )
    )
    --anzahl
    
    
    SELECT *
    FROM gesamtStimmenProParteiProStimmkreis
    `
  );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

export default router;
