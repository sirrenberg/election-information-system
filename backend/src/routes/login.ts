import express from "express";
import pool from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

// router.post("/", async (req, res) => {
//   try {
//     const hashedPassword = await bcrypt.hash(req.body.password, 10);

//     const user = { id: req.body.id, password: hashedPassword };

//     res.status(200).send();
//   } catch (err) {
//     res.status(500).send();
//   }
// });

router.post("/", async (req, res) => {
  // get user with id
  const { rows, rowCount } = await pool.query(
    `SELECT *
      FROM waehler
      WHERE id = $1`,
    [req.body.id]
  );

  // check if user exists
  if (rowCount === 0) {
    res.status(404).send();
    return;
  }

  try {
    // compare password with hashed password
    if (await bcrypt.compare(req.body.password, rows[0].password)) {
      // create token
      const user = { id: req.body.id };

      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "10m",
      });

      res.json({ accessToken: accessToken });

      res.status(200).send();
    } else {
      // wrong password
      res.status(401).send();
    }
  } catch (err) {
    res.status(500).send();
  }
});

export default router;
