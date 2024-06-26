// src/routes/users.ts
import express from "express";
import pool from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { rows } = await pool.query(
      `
		WITH 
		-- die Kandidaten, die ihren Stimmkreis gewonnen haben
		winnerStimmkreis AS (
			SELECT
				k1.kandidatenid,
				k1.stimmkreisid,
				k1.anzahlstimmen,
				k1.datum
			FROM
				kandidiert_erststimmen k1
			WHERE
				NOT EXISTS (
					SELECT 1
					FROM kandidiert_erststimmen k2
					WHERE k2.anzahlstimmen > k1.anzahlstimmen AND k2.stimmkreisid = k1.stimmkreisid AND k1.datum = k2.datum
				)
				AND
					k1.datum = '2023-10-08'
				
		),
		-- die Kandidaten, die ihren Stimmkreis nicht gewonnen haben
		loserStimmkreis AS (
			SELECT
				k.kandidatenid,
				k.stimmkreisid,
				k.anzahlstimmen,
				k.datum
			FROM
				kandidiert_erststimmen k
			WHERE
				NOT EXISTS (
					SELECT 1
					FROM winnerStimmkreis w
					WHERE k.kandidatenid = w.kandidatenid AND w.datum = '2023-10-08'
				)
				AND
					k.datum = '2023-10-08'
		),
		-- die Anzahl der Direktmandate, die diese Partei in diesem Wahlkreis ergattern konnte
		anzahlDirekmandatenImWahlkreis AS(
			SELECT
				k.parteiid,
				s.wahlkreisid,
				COUNT(w.kandidatenid) AS anzahlDirektkandidaten
			FROM
				winnerStimmkreis w
				INNER JOIN
				stimmkreise s
				ON w.stimmkreisid = s.stimmkreisid
				INNER JOIN
				kandidaten k
				ON w.kandidatenid = k.kandidatenid
			GROUP BY k.parteiid, s.wahlkreisid
		),
		-- Alle Parteien mit einem Wahlkreis zusammen
		alleParteienMitWahlkreis AS(
			SELECT
				parteiid,
				wahlkreisid
			FROM
				parteien p
				CROSS JOIN
				(SELECT DISTINCT wahlkreisid FROM anzahlDirekmandatenImWahlkreis)
			ORDER BY
				wahlkreisid
		),
		-- anzahlDirektmandatenImWahlkreis, Parteien ohne Direktmandat tauchen mit Wert 0 auf.
		anzahlDirektmandateImWahlkreisAlleParteien AS(
			SELECT
				p.parteiid,
				p.wahlkreisid,
				COALESCE(a.anzahldirektkandidaten, 0) AS anzahldirektkandidaten
			FROM
				alleParteienMitWahlkreis p
				LEFT JOIN
				anzahlDirekmandatenImWahlkreis a
				ON
				p.parteiid = a.parteiid AND p.wahlkreisid = a.wahlkreisid
			ORDER BY
				wahlkreisid
		),
		-- die Anzahl der Sitze, die diese Partei in diesem Wahlkreis bekommen sollte
		seats AS (
			SELECT 
				*
			FROM 
				CalculateSeatAllocation() c,
				parteien p
			WHERE
				c.sa_parteiid = p.parteiid
			ORDER BY 
				c.sa_wahlkreisid, p.parteiid
		),
		-- Anzahl der Sitze, die diese Partei noch in diesem Wahlkreis bekommen muss
		anzahlZuBesetzen AS (
			SELECT
				a.parteiid,
				a.wahlkreisid,
				COALESCE(s.sa_allocated_seats - a.anzahlDirektkandidaten, 0) AS anzahlzuBesetzenderSitze
			FROM
				seats s
				RIGHT OUTER JOIN
				anzahlDirektmandateImWahlkreisAlleParteien a
				ON s.sa_parteiid = a.parteiid AND s.sa_wahlkreisid = a.wahlkreisid 
		),
		-- Setze die Anzahl der zu besetzenden Sitze auf 0, falls sie vorher negativ war.
		anzahlzuBesetzenNotNegative AS (
			SELECT
				parteiid,
				wahlkreisid,
				CASE
					WHEN anzahlzuBesetzenderSitze < 0 THEN 0
					ELSE anzahlzuBesetzenderSitze
				END AS anzahlzuBesetzenderSitze
			FROM anzahlZuBesetzen	
		),
		-- Summe der Zweitstimmen für jeden Kandidaten der kein Direktmandat gewonnen hat
		summeZweitstimmen AS (
			SELECT
				ls.kandidatenID,
				k.kandidatenNamen,
				sum(kz.anzahlStimmen) AS anzahlZweitstimmen,
				s.wahlkreisID,
				k.parteiid
			FROM
				loserStimmkreis ls
				INNER JOIN
				stimmkreise s
				ON
				ls.stimmkreisID = s.stimmkreisID
				INNER JOIN
				kandidaten k
				ON
				k.kandidatenID = ls.kandidatenID
				INNER JOIN
				kandidiert_zweitstimmen kz
				ON 
				ls.kandidatenID = kz.kandidatenID
			WHERE
				ls.datum = '2023-10-08' and kz.datum = '2023-10-08'
			GROUP BY
				s.wahlkreisID, ls.kandidatenID, k.kandidatenNamen, k.parteiID
			ORDER BY
				anzahlZweitstimmen DESC
		),
		-- addiere noch die Erststimmen drauf, denn die fließen da irgendwie auch mit ein beim hochvoten....
		summeErststimmen AS(
			SELECT
				ls.kandidatenID,
				k.kandidatenNamen,
				sum(ke.anzahlStimmen) AS anzahlErststimmen,
				s.wahlkreisID,
				k.parteiid
			FROM
				loserStimmkreis ls
				INNER JOIN
					stimmkreise s
					ON
					ls.stimmkreisID = s.stimmkreisID
				INNER JOIN
					kandidaten k
					ON
					k.kandidatenID = ls.kandidatenID
				INNER JOIN
					kandidiert_erststimmen ke
					ON
					ls.kandidatenid = ke.kandidatenid
			WHERE
				ls.datum = '2023-10-08' AND ke.datum = '2023-10-08'
			GROUP BY
				s.wahlkreisID, ls.kandidatenID, k.kandidatenNamen, k.parteiID
			ORDER BY
				anzahlErststimmen DESC
		),
		summeGesamtstimmen AS(
			SELECT
				se.kandidatenID,
				se.kandidatenNamen,
				se.anzahlErststimmen + sz.anzahlZweitstimmen AS anzahlGesamtstimmen,
				se.wahlkreisID,
				se.parteiid
			FROM
				summeErststimmen se
				INNER JOIN
				summeZweitstimmen sz
				ON
				se.kandidatenID = sz.kandidatenID
			ORDER BY anzahlGesamtstimmen DESC
		),
		-- erstelle ein Ranking der Kandidaten basierend auf ihrer Zweitstimmenanzahl
		rankedCandidatesByZweitstimmen AS (
			SELECT
				kandidatenid,
				kandidatennamen,
				anzahlGesamtstimmen,
				wahlkreisid,
				parteiid,
				(SELECT 
					COUNT(*) + 1 
				FROM
					summeGesamtstimmen sg2
				WHERE
					sg1.parteiID = sg2.parteiID
					AND
					sg1.wahlkreisID = sg2.wahlkreisID
					AND
					sg2.anzahlGesamtstimmen > sg1.anzahlGesamtstimmen
					
					) AS ranking
			FROM
				summeGesamtstimmen sg1
		),
		-- Nimm die obersten n Kandidaten die noch nicht ein Direktmandat bekommen haben (mit LIMIT kann man einstellen,
		-- dass nicht zu viele Werte genommen werden, wenn zwei Kandidaten die gleiche Anzahl an Zweitstimmen haben.
		mandateDurchZweitstimmen AS (
			SELECT
				r.kandidatenid,
				r.kandidatennamen,
				r.anzahlGesamtstimmen,
				r.wahlkreisid,
				r.parteiid
			FROM
				rankedCandidatesByZweitstimmen r
				INNER JOIN
				anzahlzuBesetzenNotNegative a
				ON
				r.parteiID = a.parteiID AND r.wahlkreisid = a.wahlkreisid
			WHERE
				r.ranking <= a.anzahlzuBesetzenderSitze 
		),
		-- diese Queries werden erstellt, um die Ausgabe schöner und einheitlicher zu machen.
		prettyDirektmandate AS (
			SELECT
				w.kandidatenID,
				k.kandidatenNamen,
				s.wahlkreisID,
				wk.wahlkreisName,
				w.stimmkreisID::VARCHAR,
				s.name AS stimmkreisName,
				k.parteiid,
				p.parteiname,
				p.kurzbezeichnung
			FROM
					winnerStimmkreis w
				INNER JOIN
					kandidaten k
					ON
					w.kandidatenID = k.kandidatenID
				INNER JOIN
					parteien p
					ON
					k.parteiid = p.parteiid
				INNER JOIN
					stimmkreise s
					ON
					w.stimmkreisID = s.stimmkreisID
				INNER JOIN
					wahlkreise wk
					ON
					s.wahlkreisID = wk.wahlkreisID
		),
		prettyListenMandate AS (
			SELECT
				mdz.kandidatenID,
				mdz.kandidatenNamen,
				mdz.wahlkreisID,
				w.wahlkreisName,
				'Wkz.' AS stimmkreisID,
				w.wahlkreisName AS stimmkreisName,
				mdz.parteiid,
				p.parteiname,
				p.kurzbezeichnung
			FROM
					mandateDurchZweitstimmen mdz
				INNER JOIN
					parteien p
					ON
					p.parteiid = mdz.parteiid
				INNER JOIN
					wahlkreise w
					ON
					w.wahlkreisID = mdz.wahlkreisID
		),
		finalResult AS (
			SELECT *
			FROM prettyListenMandate
			UNION ALL
			SELECT *
			FROM prettyDirektmandate
			ORDER BY kandidatenNamen
		)

		SELECT *
		FROM finalResult

	  `
    );    
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

export default router;
