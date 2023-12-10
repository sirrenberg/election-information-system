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
    -- ranking der Differenzen für jede Partei für die Sieger
    rankingSiegerUndZweite AS (
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
    -- Anzahl der Zweiten für jede Partei
    anzahlZweiterProPartei AS (
        SELECT
            COUNT(*) AS anzahlZweiter,
            s.parteiid
        FROM
            secondStimmkreis s
        GROUP BY
            s.parteiid
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
    -- Gibt an, wie viele knappste Zweite z pro Partei angezeigt werden sollen, mit z = 10 - n. Falls die Partei nicht 
    -- genug Stimmkreise gewonnen hat, um das zu liefern, 
    anzahlKnappsteZweiteProPartei AS (
        SELECT
            az.parteiid,
            CASE
                WHEN aks.anzahlKnappsteSieger + az.anzahlZweiter > 10
                THEN 10 - aks.anzahlKnappsteSieger
                ELSE az.anzahlZweiter
            END AS anzahlKnappsteZweite
        FROM 
            anzahlZweiterProPartei az
            INNER JOIN
            anzahlKnappsteSiegerProPartei aks
            ON
            az.parteiid = aks.parteiid
    ),
    -- die knappsten Sieger und Zweite für jede Partei
    knappsteSiegerUndZweite AS (
        SELECT
            p.parteiid AS betrachtePartei,
            r.*,
            aks.anzahlKnappsteSieger,
            akz.anzahlKnappsteZweite
        FROM
            rankingSiegerUndZweite r
            INNER JOIN
            anzahlKnappsteSiegerProPartei aks
            ON 
            r.siegerparteiid = aks.parteiid
            INNER JOIN
            anzahlKnappsteZweiteProPartei akz
            ON
            r.zweiterparteiid = akz.parteiid
            CROSS JOIN
            parteien p
        WHERE
            p.parteiid = r.siegerParteiID
            AND
            r.siegerranking <= aks.anzahlKnappsteSieger 
            OR
            p.parteiid = r.zweiterParteiID
            AND
            r.zweiterranking <= akz.anzahlKnappsteZweite
    )
    
    SELECT 
        ksuz.betrachtepartei,
        ksuz.stimmkreisid,
        ksuz.differenz,
        ksuz.siegerkandidatenid,
        ksuz.siegername,
        ksuz.siegerparteiid,
        ksuz.zweiterkandidatenid,
        ksuz.zweitername,
        ksuz.zweiterparteiid
    FROM 
        knappsteSiegerUndZweite ksuz
    ORDER BY
        ksuz.betrachtepartei, ksuz.differenz
    
    `
  );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

export default router;
