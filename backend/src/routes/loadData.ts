import express from "express";
import pool from "../db.js";
import { v4 } from "uuid";
import fs from "fs";
import path from "path";

import { fileURLToPath } from "url";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const files = await fs.promises.readdir(path.join(__dirname, "../../data"));

    for (const file of files) {
      const filePath = path.join(__dirname, "../../data", file);

      const data = await fs.promises.readFile(filePath, "utf-8");
      await pool.query(data);
    }

    generateVoters();

    res.status(200).send("Queries Executed Successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

async function generateVoters() {
  let randomFirstNames: string[] = [];
  getFirstNames()
    .then((data) => {
      randomFirstNames = data as string[];
    })
    .catch((err) => {
      console.error(err);
    });

  let randomLastNames: string[] = [];
  getLastNames()
    .then((data) => {
      randomLastNames = data as string[];
    })
    .catch((err) => console.error(err));

  const { rows } = await pool.query(`SELECT * 
                  FROM anzahlStimmberechtigteUndWaehler 
                  WHERE datum = '2023-10-08'`);

  for (const row of rows) {
    let queryBuilder = `INSERT INTO waehler (waehlerid, vorname, nachname, stimmkreisid) VALUES `;
    const { stimmkreisid, anzahlstimmberechtigte } = row;

    for (let i = 0; i < anzahlstimmberechtigte; i++) {
      const waehlerId = v4();
      const randomFirstName =
        randomFirstNames[Math.floor(Math.random() * randomFirstNames.length)];
      const randomLastName =
        randomLastNames[Math.floor(Math.random() * randomLastNames.length)];

      queryBuilder += `('${waehlerId}', '${randomFirstName}', '${randomLastName}', ${stimmkreisid}),`;
    }

    queryBuilder = queryBuilder.slice(0, -1) + ";";
    console.log(queryBuilder);

    pool
      .query(queryBuilder)
      .then(() => console.log("Voters Generated Successfully"))
      .catch((err) => console.error(err));
  }
}

// returns a promise that resolves to an array of first names
function getFirstNames() {
  return new Promise((resolve, reject) => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    fs.readFile(
      path.join(__dirname, "../../misc/nachnamen.txt"),
      "latin1",
      (err, data) => {
        if (err) {
          reject(err);
          return;
        }

        const firstNames = data.split("\n");
        resolve(firstNames);
      }
    );
  });
}

function getLastNames() {
  return new Promise((resolve, reject) => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    fs.readFile(
      path.join(__dirname, "../../misc/vornamen.csv"),
      "utf-8",
      (err, data) => {
        if (err) {
          reject(err);
          return;
        }

        const rows = data.split("\n");
        const lastNames = rows.map((row) => row.split(",")[0]);
        resolve(lastNames);
      }
    );
  });
}

export default router;
