    with erstStimmenProParteiProWahlkreis as (
      SELECT p.parteiid, p.kurzbezeichnung, w.wahlkreisid, COALESCE(SUM(ks.anzahlstimmen), 0) as erststimmen
      FROM parteien p
      LEFT OUTER JOIN kandidaten k ON p.parteiid = k.parteiid
      LEFT OUTER JOIN kanditiertstimmkreis ks ON k.kandidatenid = ks.kandidatenid
      JOIN stimmkreise s ON ks.stimmkreisid = s.stimmkreisid
      JOIN wahlkreise w ON s.wahlkreisid = w.wahlkreisid
    --  WHERE datum = '2023-10-08'
      GROUP BY p.parteiid, p.kurzbezeichnung, w.wahlkreisid

    ),

    zweitStimmenProParteiProWahlkreis as (
      SELECT p.parteiid, p.kurzbezeichnung, kw.wahlkreisid, COALESCE(SUM(kw.anzahlstimmen), 0) as zweitstimmen
      FROM parteien p
      LEFT OUTER JOIN kandidaten k ON p.parteiid = k.parteiid
      LEFT OUTER JOIN kandidiertwahlkreis kw ON k.kandidatenid = kw.kandidatenid
    --  WHERE kw.datum = '2023-10-08'
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
    ),

    --------Q3--------------------
    -- 3.1 Wahlbeteiligung
    gesamtStimmenProWahlkreis as (
        SELECT g.wahlkreisid, SUM(g.gesamtstimmen) as gesamtstimmen
        FROM gesamtStimmenProParteiProWahlkreis g
        GROUP BY g.wahlkreisid
    ),

    anzWahlberechtigteProWahlkreis as (
      SELECT w.wahlkreisid, SUM(a.anzahlWahlberechtigte) as anzWahlberechtigte
      FROM wahlkreise w, Stimmkreise s, anzahlWahlberechtigte a, 
      WHERE w.wahlkreisid = s.wahlkreisid AND s.stimmkreisid =  a.stimmkreisid
      GROUP BY w.wahlkreisid
    ),

    wahlbeteiligungProWahlkreis as (
      SELECT g.wahlkreisid, (g.gesamtstimmen * 1.0) / a.anzWahlberechtigte as wahlbeteiligung
      FROM gesamtStimmenProWahlkreis g, anzWahlberechtigteProWahlkreis a
      WHERE g.wahlkreisid = a.wahlkreisid
    ),

    --3.3 die prozentuale und absolute Anzahl(schon gemacht oben) an Stimmen für jede Partei
    --
    --3.4 die Entwicklung der Stimmen im Vergleich zur Vorwahl (soweit möglich)


select * from stimmenProParteiProWahlkreisMitAnzSitze;