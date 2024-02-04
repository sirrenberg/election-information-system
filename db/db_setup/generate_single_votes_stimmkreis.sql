-- Recursive CTE to insert vote tuples depending on their number in the aggregated vote table

WITH RECURSIVE InsertRecursiveErststimmen AS (
        -- Anchor member: Initial row
        SELECT
            ke.kandidatenid AS kandidatenid,
            ke.stimmkreisid,
            ke.datum,
            1 AS Iteration
        FROM
            kandidiert_erststimmen ke
        WHERE
            ke.anzahlStimmen > 0  -- Termination condition based on the anzahlStimmen in AggregierteStimmkreisergebnisse
        AND ke.datum = '2023-10-08'        -- Comment out to choose particular stimmkreis

        UNION ALL

        -- Recursive member: Generate additional rows
        SELECT
            ir.kandidatenid,
            ir.stimmkreisid,
            ir.datum,
            ir.Iteration + 1
        FROM
            InsertRecursiveErststimmen ir
        WHERE
            ir.Iteration + 1 <= (SELECT ke.anzahlStimmen FROM kandidiert_erststimmen ke WHERE ke.kandidatenid = ir.kandidatenid 
            AND datum = ir.datum
            AND stimmkreisid = ir.stimmkreisid)  -- Termination condition based on the anzahlStimmen in AggregierteStimmkreisergebnisse
    )

-- SELECT * FROM InsertRecursiveErststimmen;

INSERT INTO erststimmen (kandidatenid, stimmkreisid, datum)
SELECT kandidatenid, stimmkreisid, datum 
FROM InsertRecursiveErststimmen;