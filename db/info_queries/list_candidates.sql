
with erstStimmenProPartei as (
  SELECT p.parteiid, p.kurzbezeichnung, COALESCE(SUM(ks.anzahlstimmen), 0) as erststimmen
  FROM parteien p
  LEFT OUTER JOIN kandidaten k ON p.parteiid = k.parteiid
  LEFT OUTER JOIN kanditiertstimmkreis ks ON k.kandidatenid = ks.kandidatenid
--  WHERE datum = '2023-10-08'
  GROUP BY p.parteiid, p.kurzbezeichnung

),

zweitStimmenProPartei as (
  SELECT p.parteiid, p.kurzbezeichnung, COALESCE(SUM(kw.anzahlstimmen), 0) as zweitstimmen
  FROM parteien p
  LEFT OUTER JOIN kandidaten k ON p.parteiid = k.parteiid
  LEFT OUTER JOIN kandidiertwahlkreis kw ON k.kandidatenid = kw.kandidatenid
--  WHERE kw.datum = '2023-10-08'
  GROUP BY p.parteiid, p.kurzbezeichnung
),

gesamtStimmenProPartei as (
  SELECT e.parteiid, e.kurzbezeichnung, e.erststimmen, z.zweitstimmen, e.erststimmen + z.zweitstimmen as gesamtstimmen
  FROM erstStimmenProPartei e
  LEFT OUTER JOIN zweitStimmenProPartei z ON e.parteiid = z.parteiid
),

gesamtstimmen as (
  SELECT SUM(gesamtstimmen) as gesamtstimmen, SUM(gesamtstimmen)*1.0/100*5 as fuenfProzentHuerde
  FROM gesamtStimmenProPartei
),

parteienÜberFünfProzent as (
  SELECT parteiid, kurzbezeichnung, gspp.gesamtstimmen, fuenfProzentHuerde
  FROM gesamtStimmenProPartei gspp, gesamtstimmen
  WHERE gspp.gesamtstimmen > fuenfProzentHuerde
),

parteienUnterFünfProzent as (
  SELECT parteiid, kurzbezeichnung, gspp.gesamtstimmen, fuenfProzentHuerde
  FROM gesamtStimmenProPartei gspp, gesamtstimmen
  WHERE gspp.gesamtstimmen <= fuenfProzentHuerde
),

gesamtstimmenDerÜberFünfProzentParteien as (
  SELECT SUM(gesamtstimmen) as gesamtstimmen
  FROM parteienÜberFünfProzent
)


CREATE TABLE parteienÜberFünfProzent AS
SELECT *
FROM MyCTE FROM parteienÜberFünfProzent;
