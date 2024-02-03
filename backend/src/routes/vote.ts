// src/routes/users.ts
import express from "express";
import pool from "../db.js";
import containsOnlyWhitelistChars from "../whitelisting.js";
import crypto from "crypto";
const router = express.Router();

router.post("/", async (req, res) => {
  const {
    voterId,
    stimmkreisid,
    selectedDirectCandidateId,
    selectedListCandidateId,
  } = req.body;

  console.log(req.body);

  if (!voterId || !stimmkreisid) {
    res.status(400).send({
      error: "Invalid input",
    });
    return;
  }

  if (
    !containsOnlyWhitelistChars(voterId) ||
    !containsOnlyWhitelistChars(String(stimmkreisid)) ||
    (selectedDirectCandidateId &&
      !containsOnlyWhitelistChars(selectedDirectCandidateId)) ||
    (selectedListCandidateId &&
      !containsOnlyWhitelistChars(selectedListCandidateId))
  ) {
    res.status(400).send({
      error: "Invalid input. Contains illegal characters",
    });
    return;
  }

  // check if voter exists
  const { rowCount: voterCount } = await pool.query(
    `SELECT * FROM wahlberechtigte WHERE waehlerid = $1`,
    [voterId]
  );

  if (voterCount === 0) {
    res.status(404).send({
      error: "User not found",
    });
    return;
  }

  // hash voterid
  const hashedVoterId = crypto
    .createHash("sha256")
    .update(voterId)
    .digest("hex");

  // check if voter has already voted

  const { rowCount: voteCount } = await pool.query(
    `SELECT * FROM voter_hashes WHERE hashvalue = $1`,
    [hashedVoterId]
  );

  console.log("voteCount", voteCount);

  if (voteCount && voteCount > 0) {
    res.status(403).send({
      error: "User already voted",
    });
    return;
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // save hash of voter
    await client.query(`INSERT INTO voter_hashes (hashvalue) VALUES ($1)`, [
      hashedVoterId,
    ]);

    // save vote
    if (selectedDirectCandidateId) {
      await client.query(
        `INSERT INTO erststimmen (kandidatenid, stimmkreisid, datum) VALUES ($1, $2, $3)`,
        [selectedDirectCandidateId, stimmkreisid, "2023-10-08"]
      );
    }

    if (selectedListCandidateId) {
      await client.query(
        `INSERT INTO zweitstimmen (kandidatenid, stimmkreisid, datum) VALUES ($1, $2, $3)`,
        [selectedDirectCandidateId, stimmkreisid, "2023-10-08"]
      );
    }

    await client.query("COMMIT");
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }

  res.status(200).send({
    message: "Vote saved successfully",
  });
});

export default router;
