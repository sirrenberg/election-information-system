INSERT INTO AggregierteWahlkreisergebnisse (
        kandidatenid, 
        wahlkreisid, 
        anzahlStimmen,
        datum) 
        Values 
            (1235, 20000, 3, '2023-10-08'), 
            (4567, 50000, 1, '2023-10-08'), 
            (1235, 20000, 2, '2018-10-14'),
            (1235, 8342947, 3, '2018-10-14')
        ;


WITH RECURSIVE InsertRecursiveZweitstimmen AS (
        -- Anchor member: Initial row
        SELECT
            s.kandidatenid AS kandidatenid,
            s.wahlkreisid,
            datum,
            1 AS Iteration
        FROM
            AggregierteWahlkreisergebnisse s
        WHERE
            s.anzahlStimmen > 0  -- Termination condition based on the anzahlStimmen in AggregierteWahlkreisergebnisse
            and s.wahlkreisid = 8342947

        UNION ALL

        -- Recursive member: Generate additional rows
        SELECT
            ir.kandidatenid,
            ir.wahlkreisid,
            ir.datum,
            ir.Iteration + 1
        FROM
            InsertRecursiveZweitstimmen ir
        WHERE
            ir.Iteration + 1 <= (SELECT anzahlStimmen FROM AggregierteWahlkreisergebnisse WHERE kandidatenid = ir.kandidatenid 
            AND datum = ir.datum
            AND wahlkreisid = ir.wahlkreisid)  -- Termination condition based on the anzahlStimmen in AggregierteWahlkreisergebnisse
    )

-- SELECT * FROM InsertRecursiveZweitstimmen;

INSERT INTO zweitstimmen (datum, kandidatenid)
SELECT datum, kandidatenid FROM InsertRecursiveZweitstimmen;
