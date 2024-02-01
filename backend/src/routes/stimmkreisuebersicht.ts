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
        k1.kandidatenid,
        k1.stimmkreisid,
        k1.anzahlstimmen
    FROM
        kandidiert_erststimmen k1
    WHERE
			k1.stimmkreisid = 402
		AND
			k1.datum = '2023-10-08'
		AND
			NOT EXISTS (
			SELECT 1
			FROM kandidiert_erststimmen k2
			WHERE k2.anzahlstimmen > k1.anzahlstimmen AND k2.stimmkreisid = k1.stimmkreisid
			)
    )

    SELECT *
        FROM
        kandidiert_erststimmen
    WHERE
			stimmkreisid = 402 
    `
  );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

export default router;
