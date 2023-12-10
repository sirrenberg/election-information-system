// src/routes/users.ts
import express from "express";
import pool from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { rows } = await pool.query(`WITH numExtraMandate AS (
      SELECT
        sa.sa_wahlkreisid,
        sa.sa_parteiid,
        sa.sa_allocated_seats AS allocated_seats,
        fsa.sa_allocated_seats AS final_allocated_seats,
        fsa.sa_allocated_seats - sa.sa_allocated_seats AS difference
      FROM SeatAllocation sa
      JOIN finalseatallocation fsa ON sa.sa_parteiid = fsa.sa_parteiid AND sa.sa_wahlkreisid = fsa.sa_wahlkreisid
    )
    
    select p.kurzbezeichnung as partei, w.wahlkreisname as wahlkreis, 
    nem.allocated_seats as raw_seats, nem.final_allocated_seats as final_seats, nem.difference
    from numExtraMandate nem, parteien p, wahlkreise w
    where nem.sa_parteiid = p.parteiid and nem.sa_wahlkreisid = w.wahlkreisid
    order by w.wahlkreisname, partei`);

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

export default router;
