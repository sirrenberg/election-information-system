-- Insert values to aggregated results
INSERT INTO AggregierteStimmkreisergebnisse (
        kandidatenid, 
        stimmkreisid, 
        anzahlStimmen,
        datum) 
        Values 
            (1234, 2, 2, '2023-10-08'), 
            (4567, 5, 5, '2023-10-08'), 
            (1234, 2, 3, '2018-10-14')
        ;

-- Recursive CTE to insert vote tuples depending on their number in the aggregated vote table

WITH RECURSIVE InsertRecursiveErststimmen AS (
        -- Anchor member: Initial row
        SELECT
            s.kandidatenid AS kandidatenid,
            s.stimmkreisid,
            datum,
            1 AS Iteration
        FROM
            AggregierteStimmkreisergebnisse s
        WHERE
            s.anzahlStimmen > 0                 -- Termination condition based on the anzahlStimmen in AggregierteStimmkreisergebnisse
--            and s.stimmkreisid = 8342947        -- Comment out to choose particular stimmkreis

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
            ir.Iteration + 1 <= (SELECT anzahlStimmen FROM AggregierteStimmkreisergebnisse WHERE kandidatenid = ir.kandidatenid 
            AND datum = ir.datum
            AND stimmkreisid = ir.stimmkreisid)  -- Termination condition based on the anzahlStimmen in AggregierteStimmkreisergebnisse
    )

-- SELECT * FROM InsertRecursiveErststimmen;

INSERT INTO erststimmen (datum, kandidatenid)
SELECT datum, kandidatenid FROM InsertRecursiveErststimmen;