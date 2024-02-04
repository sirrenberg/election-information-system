// src/routes/users.ts
import express from "express";
import pool from "../db.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    // Start both queries in parallel
    const generate_erststimmen =
      pool.query(`WITH RECURSIVE InsertRecursiveErststimmen AS (
      -- Anchor member: Initial row
      SELECT
          ke.kandidatenid AS kandidatenid,
          ke.stimmkreisid,
          ke.datum,
          1 AS Iteration
      FROM
          kandidiert_erststimmen ke
      WHERE
          ke.anzahlStimmen > 0  -- Termination condition based on the anzahlStimmen in AggregierteStimmkreisergebnisse
      AND ke.datum = '2023-10-08'        -- Comment out to choose particular stimmkreis

      UNION ALL

      -- Recursive member: Generate additional rows
      SELECT
          ir.kandidatenid,
          ir.stimmkreisid,
          ir.datum,
          ir.Iteration + 1
      FROM
          InsertRecursiveErststimmen ir
      WHERE
          ir.Iteration + 1 <= (SELECT ke.anzahlStimmen FROM kandidiert_erststimmen ke WHERE ke.kandidatenid = ir.kandidatenid 
          AND datum = ir.datum
          AND stimmkreisid = ir.stimmkreisid)  -- Termination condition based on the anzahlStimmen in AggregierteStimmkreisergebnisse
      )

      -- SELECT * FROM InsertRecursiveErststimmen;

      INSERT INTO erststimmen (kandidatenid, stimmkreisid, datum)
      SELECT kandidatenid, stimmkreisid, datum 
      FROM InsertRecursiveErststimmen;`);

    const generate_zweitstimmen =
      pool.query(`WITH RECURSIVE InsertRecursiveZweitstimmen AS (
      -- Anchor member: Initial row
      SELECT
          kz.kandidatenid AS kandidatenid,
          kz.stimmkreisid,
          kz.datum,
          1 AS Iteration
      FROM
          kandidiert_zweitstimmen kz
      WHERE
          kz.anzahlStimmen > 0  -- Termination condition based on the anzahlStimmen in AggregierteStimmkreisergebnisse
      AND kz.datum = '2023-10-08'        -- Comment out to choose particular stimmkreis

      UNION ALL

      -- Recursive member: Generate additional rows
      SELECT
          ir.kandidatenid,
          ir.stimmkreisid,
          ir.datum,
          ir.Iteration + 1
      FROM
          InsertRecursiveZweitstimmen ir
      WHERE
          ir.Iteration + 1 <= (SELECT kz.anzahlStimmen FROM kandidiert_zweitstimmen kz WHERE kz.kandidatenid = ir.kandidatenid 
          AND datum = ir.datum
          AND stimmkreisid = ir.stimmkreisid)  -- Termination condition based on the anzahlStimmen in AggregierteStimmkreisergebnisse
      )

      -- SELECT * FROM InsertRecursiveZweitstimmen;

      INSERT INTO zweitstimmen (kandidatenid, stimmkreisid, datum)
      SELECT kandidatenid, stimmkreisid, datum 
      FROM InsertRecursiveZweitstimmen;`);

    // Wait for both queries to complete
    const results = await Promise.all([
      generate_erststimmen,
      generate_zweitstimmen,
    ]);

    res.json({ message: "Votes generated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  } finally {
    pool.end();
  }
});

export default router;
