// src/routes/users.ts
import express from "express";
import pool from "../db.js";

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

export default router;
