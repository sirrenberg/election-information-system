// src/routes/users.ts
import express from "express";
import pool from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { rows } =
      await pool.query(`SELECT * FROM CalculateSeatAllocation() c, parteien p
    where c.sa_parteiid = p.parteiid
    ORDER BY c.sa_wahlkreisid, p.parteiid`);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

export default router;
