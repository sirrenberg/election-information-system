parties = [    ('Christlich-Soziale Union in Bayern e.V.', 'CSU'),
    ('BÜNDNIS 90/DIE GRÜNEN', 'GRÜNE'),
    ('FREIE WÄHLER Bayern', 'FREIE WÄHLER'),
    ('Alternative für Deutschland', 'AfD'),
    ('Sozialdemokratische Partei Deutschlands', 'SPD'),
    ('Freie Demokratische Partei', 'FDP'),
    ('DIE LINKE', 'DIE LINKE'),
    ('Bayernpartei', 'BP'),
    ('Ökologisch-Demokratische Partei', 'ÖDP'),
    ('Partei für Arbeit, Rechtsstaat, Tierschutz, Elitenförderung und basisdemokratische Initiative', 'Die PARTEI'),
    ('PARTEI MENSCH UMWELT TIERSCHUTZ', 'Tierschutzpartei'),
    ('V-Partei³ – Partei für Veränderung, Vegetarier und Veganer', 'V-Partei³'),
    ('Partei der Humanisten', 'PdH'),
    ('Basisdemokratische Partei Deutschland', 'dieBasis'),
    ('Volt Deutschland', 'Volt'),
    ('Piratenpartei Deutschland', 'PIRATEN'),
    ('Partei für Franken', 'DIE FRANKEN'),
    ('Liberal-Konservative Reformer - Die EURO-Kritiker', 'LKR'),
    ('mut', 'mut'),
    ('Partei für Gesundheitsforschung', 'Gesundheitsforschung')
]

result = map(lambda x: x[1], parties)

print(list(result))
