-- Recursive CTE to insert vote tuples depending on their number in the aggregated vote table

WITH RECURSIVE InsertRecursiveZweitstimmen AS (
        -- Anchor member: Initial row
        SELECT
            kz.kandidatenid AS kandidatenid,
            kz.stimmkreisid,
            kz.datum,
            1 AS Iteration
        FROM
            kandidiert_zweitstimmen kz
        WHERE
            kz.anzahlStimmen > 0  -- Termination condition based on the anzahlStimmen in AggregierteStimmkreisergebnisse
        AND kz.datum = '2023-10-08'        -- Comment out to choose particular stimmkreis

        UNION ALL

        -- Recursive member: Generate additional rows
        SELECT
            ir.kandidatenid,
            ir.stimmkreisid,
            ir.datum,
            ir.Iteration + 1
        FROM
            InsertRecursiveZweitstimmen ir
        WHERE
            ir.Iteration + 1 <= (SELECT kz.anzahlStimmen FROM kandidiert_zweitstimmen kz WHERE kz.kandidatenid = ir.kandidatenid 
            AND datum = ir.datum
            AND stimmkreisid = ir.stimmkreisid)  -- Termination condition based on the anzahlStimmen in AggregierteStimmkreisergebnisse
    )

-- SELECT * FROM InsertRecursiveZweitstimmen;

INSERT INTO zweitstimmen (kandidatenid, stimmkreisid, datum)
SELECT kandidatenid, stimmkreisid, datum 
FROM InsertRecursiveZweitstimmen;