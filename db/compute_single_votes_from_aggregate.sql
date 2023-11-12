-- Recursive CTE to insert vote tuples depending on their number in the aggregated vote table
WITH RECURSIVE AggregierteStimmkreisergebnisse (kandidatenid, anzahlStimmen) AS (
    (Values (1234, 2), (4567, 5))
),
InsertRecursive AS (
    -- Anchor member: Initial row
    SELECT
        s.kandidatenid AS kandidatenid,
        1 AS Iteration
    FROM
        AggregierteStimmkreisergebnisse s
    WHERE
        s.anzahlStimmen > 0  -- Termination condition based on the anzahlStimmen in AggregierteStimmkreisergebnisse

    UNION ALL

    -- Recursive member: Generate additional rows
    SELECT
        ir.kandidatenid,
        ir.Iteration + 1
    FROM
        InsertRecursive ir
    WHERE
        ir.Iteration + 1 <= (SELECT anzahlStimmen FROM AggregierteStimmkreisergebnisse WHERE kandidatenid = ir.kandidatenid)  -- Termination condition based on the anzahlStimmen in AggregierteStimmkreisergebnisse
)

SELECT kandidatenid, Iteration FROM InsertRecursive;

INSERT INTO erststimmen (kandidatenid, stimmid)
SELECT kandidatenid, Iteration AS stimmid FROM InsertRecursive;
