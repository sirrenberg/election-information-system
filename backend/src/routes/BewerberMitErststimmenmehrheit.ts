// src/routes/users.ts
import express from "express";
import pool from "../db.js";
import containsOnlyWhitelistChars from "../whitelisting.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { rows } = await pool.query(
      ` WITH winner AS (
          SELECT
            k1.kandidatenid,
            k1.stimmkreisid,
            k1.anzahlstimmen
          FROM
            kanditiertstimmkreis k1
          WHERE
            NOT EXISTS (
              SELECT 1
              FROM kanditiertstimmkreis k2
              WHERE k2.anzahlstimmen > k1.anzahlstimmen AND k2.stimmkreisid = k1.stimmkreisid
            )
        )

        SELECT
          w.kandidatenid,
          w.stimmkreisid,
          w.anzahlstimmen,
          k.kandidatennamen,
          k.parteiid,
          p.kurzbezeichnung,
          p.farbe,
          s.name AS stimmkreisname
        FROM
          winner w
        INNER JOIN kandidaten k ON w.kandidatenid = k.kandidatenid
        INNER JOIN parteien p ON k.parteiid = p.parteiid
        INNER JOIN stimmkreise s ON s.stimmkreisid = w.stimmkreisid;
`

// Now you can use the 'sqlQuery' variable wherever you need the SQL query in your JavaScript code.

    );    
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});


router.get("/:stimmkreisid", async (req, res) => {
  try {
    if (!(containsOnlyWhitelistChars(req.params.stimmkreisid))) {
      res.status(400).send("Bad Request");
      return;
    }
    const { rows } = await pool.query(
      ` WITH winner AS (
          SELECT
            k1.kandidatenid,
            k1.stimmkreisid,
            k1.anzahlstimmen
          FROM
            kanditiertstimmkreis k1
          WHERE
            k1.stimmkreisid = ${req.params.stimmkreisid} AND
            NOT EXISTS (
              SELECT 1
              FROM kanditiertstimmkreis k2
              WHERE k2.anzahlstimmen > k1.anzahlstimmen AND k2.stimmkreisid = k1.stimmkreisid
            )
        )

        SELECT
          w.kandidatenid,
          w.stimmkreisid,
          w.anzahlstimmen,
          k.kandidatennamen,
          k.parteiid,
          p.kurzbezeichnung,
          p.farbe,
          s.name AS stimmkreisname
        FROM
          winner w
        INNER JOIN kandidaten k ON w.kandidatenid = k.kandidatenid
        INNER JOIN parteien p ON k.parteiid = p.parteiid
        INNER JOIN stimmkreise s ON s.stimmkreisid = w.stimmkreisid;
`
    );    
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

export default router;
