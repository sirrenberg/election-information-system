import pandas as pd

# Provide the path to your Excel file
excel_file_path = r'C:\election-information-system\db\data\08_10_2023_Landtagswahl_2023_Stimmkreise_Bayern.xlsx'

# Read the Excel file into a DataFrame
df = pd.read_excel(excel_file_path)

# TODO:Still need to model Sonstige Parteien (For Zweitstimmen)
# TODO: Get Zweitstimmen for parties without direct candidates
# TODO: Get data for 2018
# TODO: ungültige Stimmen
def get_candidates():
    parties_shorts = ['CSU', 'GRÜNE', 'FREIE WÄHLER', 'AfD', 'SPD', 'FDP',
                      'DIE LINKE', 'BP', 'ÖDP', 'Die PARTEI', 'Tierschutzpartei', 
                      'V-Partei³', 'PdH', 'dieBasis', 'Volt']
    
    candidate_id = 1

    candidate_builder = "INSERT INTO kandidaten VALUES \n"
    kandidiert_ks_builder = "INSERT INTO kanditiertstimmkreis VALUES \n"
    kandidiert_wk_builder = "INSERT INTO kandidiertwahlkreis VALUES \n"
    
    for party_index, party in enumerate(parties_shorts):
        for row_index, row in df.iterrows():
            
            # Skip empty rows
            if row["Bewerber " + party] == "-":
                continue
            
            candidate_builder += "({candidate_id}, '{candidate_name}', {party_id}),\n".format(
                                  candidate_id=candidate_id, 
                                  candidate_name=row["Bewerber " + party], 
                                  party_id=party_index + 1)
            
            kandidiert_ks_builder += "({candidate_id}, {stimmkreis_id}, {date}, {num_votes}),\n".format(
                                  candidate_id=candidate_id, 
                                  stimmkreis_id=row["Schlüssel- nummer"], 
                                  date="'2023-10-08'",
                                  num_votes=row["Erststimmen " + party + " 2023"])
            
            kandidiert_wk_builder += "({candidate_id}, {wahlkreis_id}, {date}, {num_votes}),\n".format(
                                    candidate_id=candidate_id,
                                    wahlkreis_id=row["Wahlkreisnummer"],
                                    date="'2023-10-08'",
                                    num_votes=row["Zweitstimmen " + party + " 2023"])

            candidate_id += 1

    candidate_builder = candidate_builder[:-2] + ";"
    kandidiert_ks_builder = kandidiert_ks_builder[:-2] + ";"
    kandidiert_wk_builder = kandidiert_wk_builder[:-2] + ";"

    candidate_builder = candidate_builder.encode('utf-8', 'ignore')
    kandidiert_ks_builder = kandidiert_ks_builder.encode('utf-8', 'ignore')
    kandidiert_wk_builder = kandidiert_wk_builder.encode('utf-8', 'ignore')


    with open("kandidaten.sql", "wb") as file:
        file.write(candidate_builder)

    with open("kandidiertstimmkreis.sql", "wb") as file:
        file.write(kandidiert_ks_builder)

    with open("kandidiertwahlkreis.sql", "wb") as file:
        file.write(kandidiert_wk_builder)


            

get_candidates()