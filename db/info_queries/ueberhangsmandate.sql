-- Copied from sainte_lague.sql

-- Create a stored procedure to perform Sainte-Laguë seat allocation in PostgreSQL
CREATE OR REPLACE FUNCTION CalculateSeatAllocation()
RETURNS TABLE (sa_parteiid INT, sa_wahlkreisid INT, sa_votes INT, 
sa_allocated_seats INT, sa_divisor FLOAT, sa_sitzeProWahlkreis INT, sa_maxSitze INT)
AS $$
DECLARE
    iteration INT := 1;
BEGIN

DROP TABLE IF EXISTS SeatAllocation;
DROP TABLE IF EXISTS finalSeatAllocation;

    -- Create a table to store seat allocation results
    CREATE TEMP TABLE SeatAllocation
    (
        sa_parteiid INT,
        sa_wahlkreisid INT,
        sa_votes INT,
        sa_allocated_seats INT,
        sa_divisor FLOAT,
        sa_sitzeProWahlkreis INT
    );

    with erstStimmenProParteiProWahlkreis as (
      SELECT p.parteiid, p.kurzbezeichnung, w.wahlkreisid, COALESCE(SUM(ks.anzahlstimmen), 0) as erststimmen
      FROM parteien p
      LEFT OUTER JOIN kandidaten k ON p.parteiid = k.parteiid
      LEFT OUTER JOIN kandidiert_erststimmen ks ON k.kandidatenid = ks.kandidatenid
      JOIN stimmkreise s ON ks.stimmkreisid = s.stimmkreisid
      JOIN wahlkreise w ON s.wahlkreisid = w.wahlkreisid
      WHERE datum = '2023-10-08'
      GROUP BY p.parteiid, p.kurzbezeichnung, w.wahlkreisid

    ),

    kandidiertwahlkreis as (
      SELECT 
          *
      FROM 
          kandidiert_zweitstimmen kz
      INNER JOIN
          stimmkreise s
          ON
          s.stimmkreisid = kz.stimmkreisid
    ),

    zweitStimmenProParteiProWahlkreis as (
      SELECT p.parteiid, p.kurzbezeichnung, kw.wahlkreisid, COALESCE(SUM(kw.anzahlstimmen), 0) as zweitstimmen
      FROM parteien p
      LEFT OUTER JOIN kandidaten k ON p.parteiid = k.parteiid
      LEFT OUTER JOIN kandidiertwahlkreis kw ON k.kandidatenid = kw.kandidatenid
      WHERE kw.datum = '2023-10-08'
      GROUP BY p.parteiid, p.kurzbezeichnung, kw.wahlkreisid
    ),

    gesamtStimmenProParteiProWahlkreis as (
      SELECT e.parteiid, e.kurzbezeichnung, e.wahlkreisid, e.erststimmen, z.zweitstimmen, e.erststimmen + z.zweitstimmen as gesamtstimmen
      FROM erstStimmenProParteiProWahlkreis e, zweitStimmenProParteiProWahlkreis z
      WHERE e.parteiid = z.parteiid AND e.wahlkreisid = z.wahlkreisid
    ),


    gesamtStimmenProPartei as (
      SELECT parteiid, kurzbezeichnung, sum(erststimmen), sum(zweitstimmen), sum(gesamtstimmen) as gesamtstimmen
      from gesamtStimmenProParteiProWahlkreis
      GROUP BY parteiid, kurzbezeichnung
    ),

    gesamtstimmen as (
      SELECT SUM(gesamtstimmen) as gesamtstimmen, SUM(gesamtstimmen)*1.0/100*5 as fuenfProzentHuerde
      FROM gesamtStimmenProPartei
    ),

    parteienÜberFünfProzent(parteiid, kurzbezeichnung, gesamtstimmen, fuenfProzentHuerde) as (
      SELECT parteiid, kurzbezeichnung, gspp.gesamtstimmen, fuenfProzentHuerde
      FROM gesamtStimmenProPartei gspp, gesamtstimmen
      WHERE gspp.gesamtstimmen > fuenfProzentHuerde
    ),

    gesamtstimmenDerÜberFünfProzentParteienProWahlkreis as (
      SELECT g.parteiid, g.kurzbezeichnung, g.wahlkreisid, g.gesamtstimmen
      FROM gesamtStimmenProParteiProWahlkreis g, parteienÜberFünfProzent p
      WHERE g.parteiid = p.parteiid
    ),

    stimmenProParteiProWahlkreisMitAnzSitze as (
      SELECT g.parteiid, g.kurzbezeichnung, g.wahlkreisid, g.gesamtstimmen, w.anzahlSitze
      FROM gesamtstimmenDerÜberFünfProzentParteienProWahlkreis g, wahlkreise w
      WHERE g.wahlkreisid = w.wahlkreisid
    )


    -- Insert initial data into the temporary table
    INSERT INTO SeatAllocation (sa_parteiid, sa_wahlkreisid, sa_votes, sa_allocated_seats, sa_divisor, sa_sitzeProWahlkreis)
    SELECT parteiid, wahlkreisid, gesamtstimmen, 0, 0.5, anzahlSitze
    FROM stimmenProParteiProWahlkreisMitAnzSitze;


--RAISE NOTICE 'Iteration: %', iteration;



    -- Use a loop for the iterative process
    WHILE iteration <= 200 LOOP

        -- Select the party with the highest quotient
        with winning_parties(parteiid, wahlkreisid) as (
          SELECT s2.sa_parteiid, s2.sa_wahlkreisid
          FROM SeatAllocation s2
          -- no quotient higher exists
          WHERE NOT EXISTS (
            SELECT *
            FROM SeatAllocation s3
            WHERE s3.sa_wahlkreisid = s2.sa_wahlkreisid
            AND s3.sa_votes*1.0/s3.sa_divisor > s2.sa_votes*1.0/s2.sa_divisor
          )
          -- check if seat limit of wahlkreis reached
          AND (SELECT SUM(s4.sa_allocated_seats) 
              FROM SeatAllocation s4
              WHERE s4.sa_wahlkreisid = s2.sa_wahlkreisid
              GROUP BY s4.sa_wahlkreisid) < s2.sa_sitzeProWahlkreis
        )

        -- Update SeatAllocation by incrementing allocated_seats and divisor for the winning party
        UPDATE SeatAllocation AS s1
        SET sa_allocated_seats = s1.sa_allocated_seats + 1,
            sa_divisor = s1.sa_divisor + 1
        FROM winning_parties
        WHERE s1.sa_parteiid = winning_parties.parteiid
        AND s1.sa_wahlkreisid = winning_parties.wahlkreisid;

        -- Increment the iteration counter
        iteration := iteration + 1;
    END LOOP;

    -- Create a table to store final seat allocation results
    CREATE TEMP TABLE finalSeatAllocation
    (
        sa_parteiid INT,
        sa_wahlkreisid INT,
        sa_votes INT,
        sa_allocated_seats INT,
        sa_divisor FLOAT,
        sa_sitzeProWahlkreis INT,
        sa_maxSitze INT
    );

    -- gets the winning direct candidates for 2023 election
    WITH stimmkreis_gewinner as (SELECT DISTINCT ks1.stimmkreisid, ks1.kandidatenid as gewinner
    FROM kandidiert_erststimmen ks1
    WHERE ks1.datum = '2023-10-08'
    and ks1.anzahlStimmen = (SELECT MAX(ks2.anzahlStimmen) 
                        FROM kandidiert_erststimmen ks2
                        WHERE ks1.datum = ks2.datum and ks1.stimmkreisid = ks2.stimmkreisid)),

    -- sum up the number direct candidates per party per wahlkreis
    stimmkreis_gewinner_pro_partei as (SELECT p.parteiid, p.kurzbezeichnung, s.wahlkreisid, count(*) as num_gewinner
      FROM parteien p, kandidaten k, stimmkreis_gewinner sg, stimmkreise s
      WHERE p.parteiid = k.parteiid and k.kandidatenid = sg.gewinner and s.stimmkreisid = sg.stimmkreisid
      GROUP BY p.parteiid, p.kurzbezeichnung, s.wahlkreisid),

    -- calculate number of überhangmandate
    numUeberhangsmandate as (SELECT sa.*, 
      CASE 
        WHEN COALESCE(skpp.num_gewinner, 0) - sa.sa_allocated_seats < 0 THEN 0
        ELSE COALESCE(skpp.num_gewinner, 0) - sa.sa_allocated_seats
      END AS numUeber
      FROM SeatAllocation sa 
      LEFT OUTER JOIN stimmkreis_gewinner_pro_partei skpp 
      ON (sa.sa_parteiid = skpp.parteiid and sa.sa_wahlkreisid = skpp.wahlkreisid)),

    -- Display the final seat allocation results
    RETURN QUERY SELECT * FROM numUeberhangsmandate;

    -- Drop the temporary table
    DROP TABLE SeatAllocation;
END;
$$ LANGUAGE plpgsql;
