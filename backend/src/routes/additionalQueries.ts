// src/routes/users.ts
import express from "express";
import pool from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
  const { rows } = await pool.query(
    `
    WITH 
    absoluteAnzahlStimmenWahlkreis AS(
	SELECT sgs.kurzbezeichnung, sum(sgs.anzahlstimmen) AS anzahlstimmen, p.farbe, sk.wahlkreisid
  	FROM 
	  	summeGesammtstimmenStimmkreis sgs
	  	INNER JOIN stimmkreise sk ON sk.stimmkreisid = sgs.stimmkreisid
	  	INNER JOIN parteien p ON p.parteiid = sgs.parteiid
  	GROUP BY
	  	sk.wahlkreisid, sgs.parteiid, sgs.kurzbezeichnung, p.farbe
  	ORDER BY
	  	sk.wahlkreisid, anzahlstimmen DESC
    ),
    anzahlStimmenTotalWahlkreis AS(
	SELECT sum(anzahlstimmen) AS anzahlstimmen, wahlkreisid
	FROM absoluteAnzahlStimmenWahlkreis
	GROUP BY wahlkreisid
    ),
    prozentStimmenRelativWahlkreis AS(
	SELECT a.kurzbezeichnung, (a.anzahlstimmen / t.anzahlstimmen) AS anzahlstimmen, a.farbe, a.wahlkreisid
	FROM
		absoluteAnzahlStimmenWahlkreis a
		INNER JOIN
		anzahlStimmenTotalWahlkreis t
		ON
		a.wahlkreisid = t.wahlkreisid
    )
    SELECT
	p.kurzbezeichnung, p.anzahlstimmen, p.wahlkreisid, w.anteilstudentenproeinwohner, w.schuldendienstproeinwohner
    FROM 
	prozentStimmenRelativWahlkreis p
	INNER JOIN
	wahlkreise w
	ON
	p.wahlkreisid = w.wahlkreisid
    WHERE
	p.kurzbezeichnung = 'AfD' OR p.kurzbezeichnung = 'GRÜNE'
    ORDER BY kurzbezeichnung
    `
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

export default router;
