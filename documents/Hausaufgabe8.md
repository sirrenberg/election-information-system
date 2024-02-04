0. Der Wähler bekommt seine ID und sein Passwort in einem Brief als Rubbellos zugesendet. Dadurch kann nur er das Passwort lesen. Wenn jemand anderes das Passwort schon vorher freigerubbelt hat, erkennt der Wähler direkt, dass das Passwort kompormitiert ist und kann sich ein neues Passwort zusenden lassen.
1. Der Wähler betritt das Wahllokal.
2. Der Wähler zeigt dem Wahlhelfer seinen Ausweis und seine Wahlbenachrichtigung.
3. Der Wähler wird an das Wahlterminal gebeten, an dem er sich mit seiner ID und seinem Passwort anmeldet.
4. In der Datenbank ist das Passwort gehashed gespeichert. Dadurch kann niemand das Passwort des Wählers aus der Datenbank klauen und stattdessen für ihn wählen.
5. Die WählerID wird in der Datenbank gehashed gespeichert. Dadurch kann er nicht doppelt wählen. Aber dadurch kann auch niemand anderes sehen, wer gewählt hat.
6. Alle Daten, die an das Backend gesendet werden, werden vom Backend geprüft, ob sie nur bestimmte gewhitelistete Zeichen enthalten. Wenn dies nicht der Fall ist, wird die Anfrage abgelehnt. Dadurch werden SQL-Injections verhindert.
7. Am Wahlterminal kann der Wähler seine Stimme abgeben. Die Stimme wird in der Datenbank gespeichert.
