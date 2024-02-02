import express from "express";
import pool from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/", async (req, res) => {
  if (![req.body.id]) {
    res.status(400).send();
    return;
  }

  // get user with first
  const { rows, rowCount } = await pool.query(
    `SELECT *
      FROM wahlberechtigte
      WHERE waehlerid = $1`,
    [req.body.id]
  );

  // check if user exists
  if (rowCount === 0) {
    res.status(404).send();
    return;
  }

  console.log(rows);

  try {
    // compare password with hashed password
    if (await bcrypt.compare(req.body.password, rows[0].passwort_hash)) {
      // create token
      const user = { id: req.body.id };

      console.log(process.env);

      const accessToken = jwt.sign(
        user,
        process.env.ACCESS_TOKEN_SECRET as string,
        {
          expiresIn: "10m",
        }
      );

      res.json({ accessToken: accessToken });

      res.status(200).send();
    } else {
      // wrong password
      res.status(401).send();
    }
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

export default router;
