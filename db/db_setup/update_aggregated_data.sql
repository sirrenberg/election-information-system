DELETE FROM kandidiert_erststimmen;
DELETE FROM kandidiert_zweitstimmen;

INSERT INTO kandidiert_erststimmen (kandidatenid, stimmkreisid, datum, anzahlStimmen)
SELECT kandidatenid, stimmkreisid, datum, COUNT(*) as anzahlStimmen
FROM erststimmen
GROUP BY kandidatenid, stimmkreisid, datum;


INSERT INTO kandidiert_zweitstimmen (kandidatenid, stimmkreisid, datum, anzahlStimmen)
SELECT kandidatenid, stimmkreisid, datum, COUNT(*) as anzahlStimmen
FROM zweitstimmen
GROUP BY kandidatenid, stimmkreisid, datum;