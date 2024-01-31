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
            k.parteiid,
            k.kandidatennamen,
            k1.stimmkreisid,
            k1.anzahlstimmen,
            k1.datum
        FROM
            kandidiert_erststimmen k1
            INNER JOIN
            kandidaten k
            ON
            k.kandidatenid = k1.kandidatenid
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
            kand.parteiid,
            kand.kandidatennamen,
            k.stimmkreisid,
            k.anzahlstimmen,
            k.datum
        FROM
            kandidiert_erststimmen k
			INNER JOIN
			kandidaten kand
			ON
			kand.kandidatenid= k.kandidatenid
        WHERE
            NOT EXISTS (
                SELECT 1
                FROM winnerStimmkreis w
                WHERE k.kandidatenid = w.kandidatenid AND w.datum = '2023-10-08'
            )
            AND
                k.datum = '2023-10-08'
    ),
    -- die Kandidaten, die zweiter in ihrem Stimmkreis geworden sind
    secondStimmkreis AS (
        SELECT
            l1.kandidatenid,
            k.kandidatennamen,
            k.parteiid,
            l1.stimmkreisid,
            l1.anzahlstimmen,
            l1.datum
        FROM
            loserStimmkreis l1
            INNER JOIN
            kandidaten k
            ON
            k.kandidatenid = l1.kandidatenid
        WHERE
            NOT EXISTS (
                SELECT 1
                FROM loserStimmkreis l2
                WHERE l2.anzahlstimmen > l1.anzahlstimmen AND l2.stimmkreisid = l1.stimmkreisid AND l1.datum = l2.datum
            )
            AND
                l1.datum = '2023-10-08'
    ),
    -- die Differenz zwischen dem ersten und dem zweiten Platz
    diffSiegerAndSecond AS (
        SELECT
            w.stimmkreisid,
            w.anzahlstimmen - s.anzahlStimmen AS differenz,
            w.kandidatenid AS siegerKandidatenID,
            w.parteiid AS siegerParteiID,
            w.kandidatennamen AS siegerName,
            s.kandidatenID AS zweiterKandidatenID,
            s.parteiid AS zweiterParteiID,
            s.kandidatennamen AS zweiterName
        FROM
            winnerStimmkreis w
            INNER JOIN
            secondStimmkreis s
            ON
            w.stimmkreisid = s.stimmkreisid
        ORDER BY
            w.stimmkreisid
    ),
	-- ranking Sieger und alle anderen
	diffLoserAndWinner AS(
		SELECT
			w.stimmkreisid,
			w.anzahlstimmen - l.anzahlStimmen AS differenz,
			w.kandidatenid AS siegerKandidatenID,
			w.parteiid AS siegerParteiID,
			w.kandidatennamen AS siegerName,
			l.kandidatenID AS loserKandidatenID,
			l.parteiid AS loserParteiID,
			l.kandidatennamen AS loserName
		FROM
			winnerStimmkreis w
			INNER JOIN
			loserStimmkreis l
			ON
			w.stimmkreisid = l.stimmkreisid
		ORDER BY
			l.parteiid, differenz
	),
    -- ranking der Differenzen für jede Partei für die Sieger
    rankingSieger AS (
        SELECT
            d1.*,
            (SELECT
                COUNT(*) + 1
             FROM
                diffSiegerAndSecond d2
             WHERE
                 d2.differenz < d1.differenz
                 AND
                 d2.siegerparteiid = d1.siegerparteiid
                ) AS siegerRanking,
            (SELECT
                COUNT(*) + 1
             FROM
                diffSiegerAndSecond d3
             WHERE
                d3.differenz < d1.differenz
                AND
                d3.zweiterparteiid = d1.zweiterparteiid
                ) AS zweiterRanking
        FROM diffSiegerAndSecond d1
        ORDER BY
            d1.differenz
    ),
    -- Anzahl der Sieger für jede Partei
    anzahlSiegerProPartei AS (
        SELECT
            COUNT(*) AS anzahlSieger,
            w.parteiid
        FROM
            winnerStimmkreis w
        GROUP BY
            w.parteiid
    ),
    -- Gibt an, wie viele knappste Sieger pro Partei angezeigt werden sollen. Wenn die Partei 10 oder mehr Stimmkreise
    -- gewonnen hat, sollen 10 knappste Sieger angezeigt werden. Sonst halt n, mit n = Anzahl der gewonnenen Stimmkreise.
    anzahlKnappsteSiegerProPartei AS (
        SELECT
            p.parteiid,
            CASE 
                WHEN a.anzahlSieger > 10
                THEN 10
                ELSE COALESCE (a.anzahlSieger, 0)
            END AS anzahlKnappsteSieger
        FROM 
            anzahlSiegerProPartei a
            RIGHT OUTER JOIN
            parteien p
            ON
            p.parteiid = a.parteiid
        ORDER BY
            p.parteiid
        
    ),
    -- die knappsten Sieger und Zweite für jede Partei
    knappsteSieger AS (
        SELECT
		    p.kurzbezeichnung AS betrachteteParteiKurz,
			p.parteiname AS betrachteteParteiName,
            r.*,
			'knappsteSiegerVsZweiter' AS tag
        FROM
            rankingSieger r
            INNER JOIN
            anzahlKnappsteSiegerProPartei aks
            ON 
            r.siegerparteiid = aks.parteiid
            INNER JOIN
            parteien p
			ON
		    p.parteiid = r.siegerParteiID
        WHERE
            r.siegerranking <= aks.anzahlKnappsteSieger 
    ),
	-- Anzahl der Politiker, die ihren Stimmkreis nicht gewonnen haben, für jede Partei
	-- Nötig, weil vielleicht manche Parteien nicht in jedem Stimmkreis einen Kandidaten haben. 
    anzahlLoserProPartei AS (
        SELECT
            COUNT(*) AS anzahlLoser,
            l.parteiid
        FROM
            loserStimmkreis l
        GROUP BY
            l.parteiid
    ),
	-- Gibt an, wie viele Politiker pro Partei "aufgefüllt" werden müssen. Wenn eine Partei keine 10 Wahlkreise 
	-- gewonnen hat, wird mit mit z = 10 - n aufgefüllt.
	-- Diese Politiker, mit denen aufgefüllt wird, haben den niedrigsten Abstand dieser Partei zum Sieger des Wahlkreises.
    anzahlKnappsteLoserProPartei AS (
        SELECT
            al.parteiid,
            CASE
                WHEN aks.anzahlKnappsteSieger + al.anzahlLoser > 10
                THEN 10 - aks.anzahlKnappsteSieger
                ELSE al.anzahlLoser
            END AS anzahlKnappsteLoser
        FROM 
            anzahlLoserProPartei al
            INNER JOIN
            anzahlKnappsteSiegerProPartei aks
            ON
            al.parteiid = aks.parteiid
    ),
	-- ranking of knappste Loser
	rankingLoser AS (
		SELECT
			l.*,
			RANK() OVER (PARTITION BY l.loserParteiID ORDER BY differenz) AS loserRanking
		FROM
			diffLoserAndWinner l
	),
	
    -- die knappsten Loser für jede Partei
	knappsteLoser AS (
        SELECT
            p.kurzbezeichnung AS betrachteteParteiKurz,
			p.parteiname AS betrachteteParteiName,
            r.*,
			'knappsterVerliererVsSieger' AS tag
        FROM
            rankingLoser r
            INNER JOIN
            anzahlKnappsteLoserProPartei akl
            ON 
            r.loserparteiid = akl.parteiid
            INNER JOIN
            parteien p
			ON
		    p.parteiid = r.loserParteiID
        WHERE
            r.loserRanking <= akl.anzahlKnappsteLoser 
    ),

	ausgabe AS (
		SELECT 
			ks.betrachteteParteiKurz,
			ks.betrachteteParteiName,
			ks.stimmkreisid,
			stim.name AS stimmkreisname,
			ks.differenz,
			ks.siegername,
			psieg.kurzbezeichnung AS siegerparteikurz,
			ks.zweitername AS verlierername,
			pzweit.kurzbezeichnung AS verliererparteikurz,
			ks.tag
		FROM 
			knappsteSieger ks
				JOIN
					parteien psieg
					ON
					psieg.parteiid = ks.siegerparteiid
				JOIN
					parteien pzweit
					ON
					pzweit.parteiid = ks.zweiterparteiid
				JOIN
					stimmkreise stim
					ON
					stim.stimmkreisid = ks.stimmkreisid
		UNION
			(SELECT 
				kl.betrachteteParteiKurz,
				kl.betrachteteParteiName,
				kl.stimmkreisid,
				stim.name AS stimmkreisname,
				kl.differenz,
				kl.siegername,
				psieg.kurzbezeichnung AS siegerparteikurz,
				kl.losername AS verlierername,
				ploser.kurzbezeichnung AS verliererparteikurz,
			 	kl.tag
			FROM 
				knappsteLoser kl
					JOIN
						parteien psieg
						ON
						psieg.parteiid = kl.siegerparteiid
					JOIN
						parteien ploser
						ON
						ploser.parteiid = kl.loserparteiid
					JOIN
						stimmkreise stim
						ON
						stim.stimmkreisid = kl.stimmkreisid))
		
    SELECT a.*
    FROM ausgabe a
    ORDER BY a.betrachteteParteiKurz, a.tag, a.differenz
    `
  );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

export default router;
