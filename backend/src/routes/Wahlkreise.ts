// src/routes/users.ts
import express from "express";
import pool from "../db.js";
import containsOnlyWhitelistChars from "../whitelisting.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM wahlkreise");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

router.get("/:wahlkreisid", async (req, res) => {
  try {
    if (!containsOnlyWhitelistChars(req.params.wahlkreisid)) {
      res.status(400).send("Bad Request");
      return;
    }

    const { rows } = await pool.query(
      `SELECT w.wahlkreisid, w.wahlkreisname, e.kurzbezeichnung, e.farbe, e.anzahlstimmen AS erststimmen, z.anzahlstimmen AS zweitstimmen, g.anzahlstimmen AS gesamtstimmen
      FROM wahlkreise w, erststimmenProParteiProWahlkreis e, zweitstimmenProParteiProWahlkreis z, gesamtStimmenProParteiProWahlkreis g
      WHERE w.wahlkreisid = e.wahlkreisid AND w.wahlkreisid = z.wahlkreisid AND w.wahlkreisid = g.wahlkreisid 
      AND e.parteiid = z.parteiid AND e.parteiid = g.parteiid
      AND w.wahlkreisid = $1`,
      [req.params.wahlkreisid]
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

export default router;
