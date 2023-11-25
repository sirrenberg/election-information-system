// src/db.ts
import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
  user: "myuser",
  host: "localhost",
  database: "electiondb",
  password: "mypassword",
  port: 5432,
});

export default pool;
