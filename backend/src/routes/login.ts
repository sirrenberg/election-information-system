import express from "express";
import pool from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import containsOnlyWhitelistChars from "../whitelisting.js";

const router = express.Router();

router.post("/", async (req, res) => {
  if (![req.body.id]) {
    res.status(400).send();
    return;
  }

  if (!containsOnlyWhitelistChars(req.body.id)) {
    res.status(400).send("Bad Request");
    return;
  }

  // get user with first
  const { rows, rowCount } = await pool.query(
    `SELECT w.*, s.name as stimmkreisname, k.wahlkreisid, k.wahlkreisname
      FROM wahlberechtigte w, stimmkreise s, wahlkreise k
      WHERE w.waehlerid = $1
      AND w.stimmkreisid = s.stimmkreisid
      AND s.wahlkreisid = k.wahlkreisid
      ;`,
    [req.body.id]
  );

  // check if user exists
  if (rowCount === 0) {
    res.status(404).send();
    return;
  }

  try {
    // compare password with hashed password
    if (await bcrypt.compare(req.body.password, rows[0].passwort_hash)) {
      // create token
      const user = { id: req.body.id };

      const accessToken = jwt.sign(
        user,
        process.env.ACCESS_TOKEN_SECRET as string,
        {
          expiresIn: "10m",
        }
      );

      const voter = {
        id: rows[0].waehlerid,
        first_name: rows[0].vorname,
        last_name: rows[0].nachname,
        stimmkreis: {
          id: rows[0].stimmkreisid,
          name: rows[0].stimmkreisname,
        },
        wahlkreis: {
          id: rows[0].wahlkreisid,
          name: rows[0].wahlkreisname,
        },
      };

      res.json({ accessToken, voter });

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
