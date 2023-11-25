import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

import partyRoutes from "./routes/parties.js";

dotenv.config();

const app: Express = express();
const port = 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World from Express and TypeScript!");
});

app.use("/parties", partyRoutes);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
