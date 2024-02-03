// src/db.ts
import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
  user: "myuser",
  host: "db", // use this if you are using docker
  // host: "localhost", // use this in npm run dev
  database: "electiondb",
  password: "mypassword",
  port: 5432,
});

export default pool;
