-- generate voters from stimmkreis data

WITH RECURSIVE InsertRecursiveWaehler AS (
        SELECT
            (SELECT name FROM first_names ORDER BY RANDOM() LIMIT 1) AS vorname,
            (SELECT name FROM first_names ORDER BY RANDOM() LIMIT 1) AS nachname,
            s.stimmkreisid,
            s.anzahlStimmberechtigte,
            (SELECT MD5(RANDOM()::text)) as passwort,
            1 AS Iteration
        FROM
            anzahlStimmberechtigteUndWaehler s
        WHERE
            s.datum = '2023-10-08'               -- Termination condition based on the anzahlStimmen in AggregierteStimmkreisergebnisse
            -- Termination condition based on the anzahlStimmen in AggregierteStimmkreisergebnisse

        UNION ALL

        SELECT
            (SELECT name FROM first_names ORDER BY RANDOM() LIMIT 1) AS vorname,
            (SELECT name FROM first_names ORDER BY RANDOM() LIMIT 1) AS nachname,
            ir.stimmkreisid,
            ir.anzahlStimmberechtigte,
            (SELECT MD5(RANDOM()::text)) as passwort,
            ir.Iteration + 1
        FROM
            InsertRecursiveWaehler ir
        WHERE
            ir.Iteration + 1 <= ir.anzahlStimmberechtigte  -- Termination condition based on the anzahlStimmen in AggregierteStimmkreisergebnisse
    )

INSERT INTO wahlberechtigte (vorname, nachname, passwort_hash, stimmkreisid)
SELECT vorname, nachname, crypt(passwort, gen_salt('bf')), stimmkreisid 
FROM InsertRecursiveWaehler;




