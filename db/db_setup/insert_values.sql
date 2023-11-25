INSERT INTO Parteien(parteiid,parteiname, kurzbezeichnung) VALUES
    (1, 'Christlich-Soziale Union in Bayern e.V.', 'CSU'),
    (2, 'BÜNDNIS 90/DIE GRÜNEN', 'GRÜNE'),
    (3, 'FREIE WÄHLER Bayern', 'FREIE WÄHLER'),
    (4, 'Alternative für Deutschland', 'AfD'),
    (5, 'Sozialdemokratische Partei Deutschlands', 'SPD'),
    (6, 'Freie Demokratische Partei', 'FDP'),
    (7, 'DIE LINKE', 'DIE LINKE'),
    (8, 'Bayernpartei', 'BP'),
    (9, 'Ökologisch-Demokratische Partei', 'ÖDP'),
    (10, 'Partei für Arbeit, Rechtsstaat, Tierschutz, Elitenförderung und basisdemokratische Initiative', 'Die PARTEI'),
    (11, 'PARTEI MENSCH UMWELT TIERSCHUTZ', 'Tierschutzpartei'),
    (12, 'V-Partei³ – Partei für Veränderung, Vegetarier und Veganer', 'V-Partei³'),
    (13, 'Partei der Humanisten', 'PdH'),
    (14, 'Basisdemokratische Partei Deutschland', 'dieBasis'),
    (15, 'Volt Deutschland', 'Volt'),
    -- After Volt, no data on candidates - (Sonstige)
    (16, 'Sonstige', 'Sonstige');
--    ('Piratenpartei Deutschland', 'PIRATEN'),
--    ('Partei für Franken', 'DIE FRANKEN'),
--    ('Liberal-Konservative Reformer - Die EURO-Kritiker', 'LKR'),
--    ('mut', 'mut'),
--    ('Partei für Gesundheitsforschung', 'Gesundheitsforschung');

INSERT INTO wahlkreise VALUES 
    (901,'Oberbayern', 61),
    (902,'Niederbayern', 18), 
    (903,'Oberpfalz', 16), 
    (904,'Oberfranken', 16), 
    (905,'Mittelfranken', 24), 
    (906,'Unterfranken', 19), 
    (907,'Schwaben', 26);

INSERT INTO Stimmkreise VALUES
(901,101,'München-Hadern'),
(901,102,'München-Bogenhausen'),
(901,103,'München-Giesing'),
(901,104,'München-Milbertshofen'),
(901,105,'München-Moosach'),
(901,106,'München-Pasing'),
(901,107,'München-Ramersdorf'),
(901,108,'München-Schwabing'),
(901,109,'München-Mitte'),
(901,110,'Altötting'),
(901,111,'Bad Tölz-Wolfratshausen, Garmisch-Partenkirchen'),
(901,112,'Berchtesgadener Land'),
(901,113,'Dachau'),
(901,114,'Ebersberg'),
(901,115,'Eichstätt'),
(901,116,'Erding'),
(901,117,'Freising'),
(901,118,'Fürstenfeldbruck-Ost'),
(901,119,'Ingolstadt'),
(901,120,'Landsberg am Lech, Fürstenfeldbruck-West'),
(901,121,'Miesbach'),
(901,122,'Mühldorf a.Inn'),
(901,123,'München-Land-Nord'),
(901,124,'München-Land-Süd'),
(901,125,'Neuburg-Schrobenhausen'),
(901,126,'Pfaffenhofen a.d.Ilm'),
(901,127,'Rosenheim-Ost'),
(901,128,'Rosenheim-West'),
(901,129,'Starnberg'),
(901,130,'Traunstein'),
(901,131,'Weilheim-Schongau'),
(902,201,'Deggendorf'),
(902,202,'Dingolfing'),
(902,203,'Kelheim'),
(902,204,'Landshut'),
(902,205,'Passau-Ost'),
(902,206,'Passau-West'),
(902,207,'Regen, Freyung-Grafenau'),
(902,208,'Rottal-Inn'),
(902,209,'Straubing'),
(903,301,'Amberg-Sulzbach'),
(903,302,'Cham'),
(903,303,'Neumarkt i.d.OPf.'),
(903,304,'Regensburg-Land'),
(903,305,'Regensburg-Stadt'),
(903,306,'Schwandorf'),
(903,307,'Tirschenreuth'),
(903,308,'Weiden i.d.OPf.'),
(904,401,'Bamberg-Land'),
(904,402,'Bamberg-Stadt'),
(904,403,'Bayreuth'),
(904,404,'Coburg'),
(904,405,'Forchheim'),
(904,406,'Hof'),
(904,407,'Kronach, Lichtenfels'),
(904,408,'Wunsiedel, Kulmbach'),
(905,501,'Nürnberg-Nord'),
(905,502,'Nürnberg-Ost'),
(905,503,'Nürnberg-Süd'),
(905,504,'Nürnberg-West'),
(905,505,'Ansbach-Nord'),
(905,506,'Ansbach-Süd, Weißenburg-Gunzenhausen'),
(905,507,'Erlangen-Höchstadt'),
(905,508,'Erlangen-Stadt'),
(905,509,'Fürth'),
(905,510,'Neustadt a.d.Aisch-Bad Windsheim, Fürth-Land'),
(905,511,'Nürnberger Land'),
(905,512,'Roth'),
(906,601,'Aschaffenburg-Ost'),
(906,602,'Aschaffenburg-West'),
(906,603,'Bad Kissingen'),
(906,604,'Haßberge, Rhön-Grabfeld'),
(906,605,'Kitzingen'),
(906,606,'Main-Spessart'),
(906,607,'Miltenberg'),
(906,608,'Schweinfurt'),
(906,609,'Würzburg-Land'),
(906,610,'Würzburg-Stadt'),
(907,701,'Augsburg-Stadt-Ost'),
(907,702,'Augsburg-Stadt-West'),
(907,703,'Aichach-Friedberg'),
(907,704,'Augsburg-Land, Dillingen'),
(907,705,'Augsburg-Land-Süd'),
(907,706,'Donau-Ries'),
(907,707,'Günzburg'),
(907,708,'Kaufbeuren'),
(907,709,'Kempten, Oberallgäu'),
(907,710,'Lindau, Sonthofen'),
(907,711,'Marktoberdorf'),
(907,712,'Memmingen'),
(907,713,'Neu-Ulm');

INSERT INTO AnzWahlberechtigte VALUES
    (101,'2023-10-08',98320),
    (102,'2023-10-08',86064),
    (103,'2023-10-08',123365),
    (104,'2023-10-08',106590),
    (105,'2023-10-08',95838),
    (106,'2023-10-08',113745),
    (107,'2023-10-08',105532),
    (108,'2023-10-08',90960),
    (109,'2023-10-08',89670),
    (110,'2023-10-08',81837),
    (111,'2023-10-08',124169),
    (112,'2023-10-08',94118),
    (113,'2023-10-08',105133),
    (114,'2023-10-08',99620),
    (115,'2023-10-08',98262),
    (116,'2023-10-08',100244),
    (117,'2023-10-08',120611),
    (118,'2023-10-08',115125),
    (119,'2023-10-08',88380),
    (120,'2023-10-08',126865),
    (121,'2023-10-08',86860),
    (122,'2023-10-08',85893),
    (123,'2023-10-08',117322),
    (124,'2023-10-08',114782),
    (125,'2023-10-08',82521),
    (126,'2023-10-08',83487),
    (127,'2023-10-08',111416),
    (128,'2023-10-08',110999),
    (129,'2023-10-08',102352),
    (130,'2023-10-08',113330),
    (131,'2023-10-08',129001),
    (201,'2023-10-08',90871),
    (202,'2023-10-08',113713),
    (203,'2023-10-08',88537),
    (204,'2023-10-08',125480),
    (205,'2023-10-08',116773),
    (206,'2023-10-08',91847),
    (207,'2023-10-08',102878),
    (208,'2023-10-08',91483),
    (209,'2023-10-08',111662),
    (301,'2023-10-08',112521),
    (302,'2023-10-08',101618),
    (303,'2023-10-08',101714),
    (304,'2023-10-08',125815),
    (305,'2023-10-08',127108),
    (306,'2023-10-08',114383),
    (307,'2023-10-08',79921),
    (308,'2023-10-08',83680),
    (401,'2023-10-08',84945),
    (402,'2023-10-08',84971),
    (403,'2023-10-08',126445),
    (404,'2023-10-08',98960),
    (405,'2023-10-08',89855),
    (406,'2023-10-08',106015),
    (407,'2023-10-08',105179),
    (408,'2023-10-08',123720),
    (501,'2023-10-08',99119),
    (502,'2023-10-08',95738),
    (503,'2023-10-08',95582),
    (504,'2023-10-08',89539),
    (505,'2023-10-08',115412),
    (506,'2023-10-08',126068),
    (507,'2023-10-08',94323),
    (508,'2023-10-08',85416),
    (509,'2023-10-08',129900),
    (510,'2023-10-08',124296),
    (511,'2023-10-08',108614),
    (512,'2023-10-08',98244),
    (601,'2023-10-08',87813),
    (602,'2023-10-08',92664),
    (603,'2023-10-08',96776),
    (604,'2023-10-08',114595),
    (605,'2023-10-08',86288),
    (606,'2023-10-08',98118),
    (607,'2023-10-08',94300),
    (608,'2023-10-08',108232),
    (609,'2023-10-08',117144),
    (610,'2023-10-08',104300),
    (701,'2023-10-08',107797),
    (702,'2023-10-08',109163),
    (703,'2023-10-08',101113),
    (704,'2023-10-08',112661),
    (705,'2023-10-08',117476),
    (706,'2023-10-08',100364),
    (707,'2023-10-08',90085),
    (708,'2023-10-08',92655),
    (709,'2023-10-08',107588),
    (710,'2023-10-08',118666),
    (711,'2023-10-08',97558),
    (712,'2023-10-08',97347),
    (713,'2023-10-08',113141);
