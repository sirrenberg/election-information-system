import express from "express";
import pool from "../db.js";
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

    res.status(200).send("Queries Executed Successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// async function generateVoters() {
//   let randomFirstNames: string[] = [];
//   getFirstNames()
//     .then((data) => {
//       randomFirstNames = data as string[];
//     })
//     .catch((err) => {
//       console.error(err);
//     });

//   let randomLastNames: string[] = [];
//   getLastNames()
//     .then((data) => {
//       randomLastNames = data as string[];
//     })
//     .catch((err) => console.error(err));

//   const { rows } = await pool.query(`SELECT *
//                   FROM anzahlStimmberechtigteUndWaehler
//                   WHERE datum = '2023-10-08'`);

//   for (const row of rows) {
//     let queryBuilder = `INSERT INTO waehler (waehlerid, vorname, nachname, stimmkreisid) VALUES `;
//     const { stimmkreisid, anzahlstimmberechtigte } = row;

//     for (let i = 0; i < anzahlstimmberechtigte; i++) {
//       const waehlerId = v4();
//       const randomFirstName =
//         randomFirstNames[Math.floor(Math.random() * randomFirstNames.length)];
//       const randomLastName =
//         randomLastNames[Math.floor(Math.random() * randomLastNames.length)];

//       queryBuilder += `('${waehlerId}', '${randomFirstName}', '${randomLastName}', ${stimmkreisid}),`;
//     }

//     queryBuilder = queryBuilder.slice(0, -1) + ";";
//     console.log(queryBuilder);

//     pool
//       .query(queryBuilder)
//       .then(() => console.log("Voters Generated Successfully"))
//       .catch((err) => console.error(err));
//   }
// }

export default router;
