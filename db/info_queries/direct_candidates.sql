-- gets the winning direct candidates for 2023 election
SELECT ks1.stimmkreisid, ks1.kandidatenid 
FROM kanditiertstimmkreis ks1
WHERE ks1.datum = '2023-10-08'
and anzahlStimmen = (SELECT MAX(anzahlStimmen) 
                    FROM kanditiertstimmkreis ks2
                    WHERE ks1.datum = ks2.datum and ks1.stimmkreisid = ks2.stimmkreisid)
