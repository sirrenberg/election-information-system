-- gets the winning direct candidates for 2023 election
WITH stimmkreis_gewinner as (SELECT DISTINCT ks1.stimmkreisid, ks1.kandidatenid as gewinner
FROM kanditiertstimmkreis ks1
WHERE ks1.datum = '2023-10-08'
and ks1.anzahlStimmen = (SELECT MAX(ks2.anzahlStimmen) 
                    FROM kanditiertstimmkreis ks2
                    WHERE ks1.datum = ks2.datum and ks1.stimmkreisid = ks2.stimmkreisid))


-- sum up the number direct candidates per party per wahlkreis
SELECT p.parteiid, p.kurzbezeichnung, s.wahlkreisid, count(*)
FROM parteien p, kandidaten k, stimmkreis_gewinner sg, stimmkreise s
WHERE p.parteiid = k.parteiid and k.kandidatenid = sg.gewinner and s.stimmkreisid = sg.stimmkreisid
GROUP BY p.parteiid, p.kurzbezeichnung, s.wahlkreisid
