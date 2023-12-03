// src/routes/users.ts
import express from "express";
import pool from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { rows } = await pool.query(
     `WITH seats AS (
        SELECT *
        FROM CalculateSeatAllocation() c,
             parteien p
        WHERE c.sa_parteiid = p.parteiid
        ORDER BY c.sa_wahlkreisid, p.parteiid
      )
      SELECT
        SUM(sa_allocated_seats) AS total_allocated_seats,
        parteiid,
        farbe,
        kurzbezeichnung
      FROM seats
      GROUP BY parteiid, farbe, kurzbezeichnung;
    `
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

export default router;
