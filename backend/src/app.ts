import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

import partyRoutes from "./routes/parties.js";
import seatRoutes from "./routes/seats.js";

dotenv.config();

const app: Express = express();
const port = 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World from Express and TypeScript!");
});

app.use("/parties", partyRoutes);
app.use("/seats", seatRoutes);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
