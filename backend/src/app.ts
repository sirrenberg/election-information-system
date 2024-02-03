import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";

// import middleware
import { authenticateToken } from "./middleware/authentication.js";

import partyRoutes from "./routes/parties.js";
import seatRoutes from "./routes/seats.js";
import candidateRoutes from "./routes/candidates.js";
import wahlkreisRoutes from "./routes/Wahlkreise.js";
import stimmkreisRoutes from "./routes/Stimmkreise.js";
import bewerberMitErststimmenMehrheitRoutes from "./routes/BewerberMitErststimmenmehrheit.js";
import absoluteStimmenverteilungParteienBayernRoutes from "./routes/absoluteStimmverteilungParteienBayern.js";
import mitgliederDesLandtagesRoutes from "./routes/MitgliederDesLandtages.js";
import ueberhangsMandateRoutes from "./routes/ueberhangsMandate.js";
import knappsteSiegerRoutes from "./routes/knappsteSieger.js";
import stimmkreisUebersichtRoutes from "./routes/stimmkreisuebersicht.js";
import loginRoutes from "./routes/login.js";
import loadData from "./routes/loadData.js";
import wahlberechtigeRoutes from "./routes/wahlberechtigte.js";
import voteRoutes from "./routes/vote.js";

dotenv.config();

const app: Express = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World from Express and TypeScript!");
});

app.use("/login", loginRoutes);
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
app.use("/MitgliederDesLandtages", mitgliederDesLandtagesRoutes);
app.use("/ueberhang_mandate", ueberhangsMandateRoutes);
app.use("/knappste-sieger-und-zweite", knappsteSiegerRoutes);
app.use("/stimmkreisuebersicht", stimmkreisUebersichtRoutes);
app.use("/wahlberechtigte", wahlberechtigeRoutes);

app.use("/init", loadData);

app.use("/vote", authenticateToken, voteRoutes);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
