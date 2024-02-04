// src/routes/users.ts
import express from "express";
import pool from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const wahlkreisid: string = req.query.id as string;

    if (wahlkreisid === undefined) {
      res.status(400).send("Bad Request");
      return;
    }
    else if(!(/^\d+$/.test(wahlkreisid))) {
      res.status(400).send("Bad Request");
      return;
    }
    const { rows: erststimmen } = await pool.query(
    `
    SELECT p.kurzbezeichnung, sum(k1.anzahlstimmen) AS anzahlstimmen, p.farbe
	FROM 
		kandidiert_erststimmen k1
		INNER JOIN
		kandidaten k
		ON
		k.kandidatenid = k1.kandidatenid
		INNER JOIN parteien p
		ON p.parteiid = k.parteiid
		INNER JOIN stimmkreise sk ON sk.stimmkreisid = k1.stimmkreisid
	WHERE
		sk.wahlkreisid = ${wahlkreisid} AND k1.datum = '2023-10-08'
	GROUP BY
		sk.wahlkreisid, p.parteiid, p.kurzbezeichnung
	ORDER BY
		sk.wahlkreisid, anzahlstimmen DESC
    `
  );

  const { rows: zweitstimmen } = await pool.query(
    `
    SELECT szs.kurzbezeichnung, sum(szs.anzahlstimmen) AS anzahlstimmen, p.farbe
	FROM 
		sumZweitstimmenStimmkreis szs
		INNER JOIN stimmkreise sk ON sk.stimmkreisid = szs.stimmkreisid
    INNER JOIN parteien p ON p.parteiid = szs.parteiid
	WHERE
		sk.wahlkreisid = ${wahlkreisid}
	GROUP BY
		sk.wahlkreisid, szs.parteiid, szs.kurzbezeichnung, p.farbe
	ORDER BY
		sk.wahlkreisid, anzahlstimmen DESC
    `
    );

    const { rows: gesamtstimmen } = await pool.query(
      `
      SELECT sgs.kurzbezeichnung, sum(sgs.anzahlstimmen) AS anzahlstimmen, p.farbe
      FROM 
          summeGesammtstimmenStimmkreis sgs
          INNER JOIN stimmkreise sk ON sk.stimmkreisid = sgs.stimmkreisid
          INNER JOIN parteien p ON p.parteiid = sgs.parteiid
      WHERE
          sk.wahlkreisid = ${wahlkreisid}
      GROUP BY
          sk.wahlkreisid, sgs.parteiid, sgs.kurzbezeichnung, p.farbe
      ORDER BY
          sk.wahlkreisid, anzahlstimmen DESC
      `
    );
    res.json({"erststimmen": erststimmen, "zweitstimmen" : zweitstimmen, "gesamtstimmen": gesamtstimmen});
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

export default router;
