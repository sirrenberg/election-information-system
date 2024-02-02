import express from "express";
import pool from "../db.js";
import bcrypt from "bcrypt";
import { v4 } from "uuid";
const router = express.Router();

router.post("/", async (req, res) => {
  // get data from request
  const { first_name, last_name, password, stimmkreis_id } = req.body;

  const id = v4();

  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // insert user into database
  try {
    await pool.query(
      `INSERT INTO wahlberechtigte (waehlerid, vorname, nachname, passwort_hash, stimmkreisid)
       VALUES ($1, $2, $3, $4, $5)`,
      [id, first_name, last_name, hashedPassword, stimmkreis_id]
    );

    res.status(200).json({ id, first_name, last_name, stimmkreis_id });
  } catch (err) {
    console.log(err);

    res.status(500).send();
  }
});

export default router;
