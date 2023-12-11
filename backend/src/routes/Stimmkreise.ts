// src/routes/users.ts
import express, { response } from "express";
import pool from "../db.js";
import containsOnlyWhitelistChars from "../whitelisting.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { rows } = await pool.query(
    `
    SELECT *
    FROM
      stimmkreise s
      INNER JOIN
      wahlkreise w
      ON
      s.wahlkreisid = w.wahlkreisid;`
  );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

router.get("/:stimmkreisid", async (req, res) => {
  if (!containsOnlyWhitelistChars(req.params.stimmkreisid)) {
    res.status(400).send("Bad Request");
    return;
  }

  const resultObject = {
    firstQuery: {},
    thirdQuery1: {},
    thirdQuery2: {},
    fourthQuery: {}
  };

  const { rows: firstQueryRes } = await pool.query(
  `SELECT w.*
   FROM wahlbeteiligungProStimmkreis w
    WHERE w.stimmkreisid = $1`,[req.params.stimmkreisid])

  resultObject.firstQuery = firstQueryRes

  //Gesamtstimmen absolut
  const { rows: thirdQueryRes1 } = await pool.query(
    `SELECT g.*
    FROM gesamtStimmenProParteiProStimmkreis g
     WHERE g.stimmkreisid = $1` ,[req.params.stimmkreisid])

  resultObject.thirdQuery1 = thirdQueryRes1  

  //Gesamtstimmen prozentual
  const { rows: thirdQueryRes2 } = await pool.query(
    `SELECT g.*
     FROM pgesamtStimmenProParteiProStimmkreis g
      WHERE g.stimmkreisid = $1`, [req.params.stimmkreisid])

  resultObject.thirdQuery2 = thirdQueryRes2

  const { rows: fourthQueryRes } = await pool.query(
    `SELECT g.*
    FROM stimmenUnterschiedProParteiProStimmkreis g
     WHERE g.stimmkreisid = $1`, [req.params.stimmkreisid])

  resultObject.fourthQuery = fourthQueryRes
  res.json(resultObject)

})

export default router;
