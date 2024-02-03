// src/routes/users.ts
import express from "express";
import pool from "../db.js";
import containsOnlyWhitelistChars from "../whitelisting.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM kandidaten");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// get candidate of stimmkreis (parameter: stimmkreisid)
router.get("/stimmkreis/:stimmkreisid", async (req, res) => {
  // check for sql injection
  if (!containsOnlyWhitelistChars(req.params.stimmkreisid)) {
    res.status(400).send({
      error: "Invalid input",
    });
    return;
  }

  try {
    const directCandidatesQueryResults = await pool.query(
      `SELECT ke.kandidatenid, ka.kandidatennamen, p.parteiid, p.parteiname, p.kurzbezeichnung, p.farbe
      FROM kandidiert_erststimmen ke, kandidaten ka, parteien p
      WHERE datum = '2023-10-08'
      AND ke.kandidatenid = ka.kandidatenid
      AND ka.parteiid = p.parteiid
      AND stimmkreisid = $1 `,
      [req.params.stimmkreisid]
    );

    const listCandidatesQueryResults = await pool.query(
      `SELECT kz.kandidatenid, ka.kandidatennamen, p.parteiid, p.parteiname, p.kurzbezeichnung, p.farbe
      FROM kandidiert_zweitstimmen kz, kandidaten ka, parteien p
      WHERE datum = '2023-10-08'
      AND kz.kandidatenid = ka.kandidatenid
      AND ka.parteiid = p.parteiid
      AND kz.stimmkreisid = $1`,
      [req.params.stimmkreisid]
    );

    res.json({
      directCandidates: directCandidatesQueryResults.rows,
      listCandidates: listCandidatesQueryResults.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

export default router;
