import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";

import partyRoutes from "./routes/parties.js";
import seatRoutes from "./routes/seats.js";
import candidateRoutes from "./routes/candidates.js";
import wahlkreisRoutes from "./routes/Wahlkreise.js";
import stimmkreisRoutes from "./routes/Stimmkreise.js";
import bewerberMitErststimmenMehrheitRoutes from "./routes/BewerberMitErststimmenmehrheit.js";
import absoluteStimmenverteilungParteienBayernRoutes from "./routes/absoluteStimmverteilungParteienBayern.js";
import MitgliederDesLandtagesRoutes from "./routes/MitgliederDesLandtages.js";

import loadData from './routes/loadData.js';

dotenv.config();

const app: Express = express();
const port = 3000;

app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World from Express and TypeScript!");
});

app.use("/parties", partyRoutes);
app.use("/candidates", candidateRoutes);
app.use("/seats", seatRoutes);
app.use("/wahlkreise", wahlkreisRoutes);
app.use("/stimmkreise", stimmkreisRoutes);
app.use(
  "/bewerberMitErststimmenMehrheit",
  bewerberMitErststimmenMehrheitRoutes
);
app.use(
  "/absoluteStimmenverteilungParteienBayern",
  absoluteStimmenverteilungParteienBayernRoutes
);
app.use("/MitgliederDesLandtages", MitgliederDesLandtagesRoutes);

app.use("/init", loadData);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
