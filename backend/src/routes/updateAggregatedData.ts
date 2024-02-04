// src/routes/users.ts
import express from "express";
import pool from "../db.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    await pool.query(`
      DELETE FROM kandidiert_erststimmen WHERE datum = '2023-10-08';
      DELETE FROM kandidiert_zweitstimmen WHERE datum = '2023-10-08';
      
      INSERT INTO kandidiert_erststimmen (kandidatenid, stimmkreisid, datum, anzahlStimmen)
      SELECT kandidatenid, stimmkreisid, datum, COUNT(*) as anzahlStimmen
      FROM erststimmen
      GROUP BY kandidatenid, stimmkreisid, datum;
      
      
      INSERT INTO kandidiert_zweitstimmen (kandidatenid, stimmkreisid, datum, anzahlStimmen)
      SELECT kandidatenid, stimmkreisid, datum, COUNT(*) as anzahlStimmen
      FROM zweitstimmen
      GROUP BY kandidatenid, stimmkreisid, datum;`);

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const filePath = path.join(__dirname, "../../data", "zzviews.sql");
    const data = await fs.promises.readFile(filePath, "utf-8");
    await pool.query(data);

    res.json({ message: "Updated data successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

export default router;
