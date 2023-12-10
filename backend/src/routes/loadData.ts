import express from "express";
import pool from "../db.js";

import fs from 'fs';
import path from 'path';

import { fileURLToPath } from "url";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const files = await fs.promises.readdir(path.join(__dirname, "../../data"));

    for (const file of files) {
      const filePath = path.join(__dirname, "../../data", file);

      const data = await fs.promises.readFile(filePath, 'utf-8');
      await pool.query(data);
    }

    res.status(200).send("Queries Executed Successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

export default router;