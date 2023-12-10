// src/routes/users.ts
import express from "express";
import pool from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { rows } =
      await pool.query(
        `
        WITH seats AS(
          SELECT
            SUM(c.sa_allocated_seats) AS sitzeZusammen,
            SUM(c.sa_votes) AS stimmen,
            p.parteiname,
            p.kurzbezeichnung,
            p.farbe,
            p.parteiid
          FROM 
            CalculateSeatAllocation() c, parteien p
          WHERE 
            c.sa_parteiid = p.parteiid
          GROUP BY 
            p.parteiid, p.farbe, p.kurzbezeichnung, p.parteiname
        )
        
        SELECT 
          *
        FROM
          seats
        `
      );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

router.get("/wahlkreise-ebene", async (req, res) => {
  try {
    const { rows } =
      await pool.query(
        `
        SELECT * 
        FROM 
          CalculateSeatAllocation() c, parteien p
        WHERE 
          c.sa_parteiid = p.parteiid
        ORDER BY 
          c.sa_wahlkreisid, p.parteiid
        `

    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

export default router;
