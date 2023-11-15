import pandas as pd

# Provide the path to your Excel file
excel_file_path = r'C:\election-information-system\db\data\08_10_2023_Landtagswahl_2023_Stimmkreise_Bayern.xlsx'

# Read the Excel file into a DataFrame
df = pd.read_excel(excel_file_path)

def get_candidates():
    parties_shorts = ['CSU', 'GRÜNE', 'FREIE WÄHLER', 'AfD', 'SPD', 'FDP',
                      'DIE LINKE', 'BP', 'ÖDP', 'Die PARTEI', 'Tierschutzpartei', 
                      'V-Partei³', 'PdH', 'dieBasis', 'Volt']
    
    candidate_id = 1

    candidate_builder = "INSERT INTO kandidaten VALUES \n"
    kandidiert_builder = "INSERT INTO kanditiertstimmkreis VALUES \n"
    
    for party_index, party in enumerate(parties_shorts):
        for row_index, row in df.iterrows():
            
            # Skip empty rows
            if row["Bewerber " + party] == "-":
                continue
            
            candidate_builder += "({candidate_id}, '{candidate_name}', {party_id}),\n".format(
                                  candidate_id=candidate_id, 
                                  candidate_name=row["Bewerber " + party], 
                                  party_id=party_index + 1)
            
            kandidiert_builder += "({candidate_id}, {stimmkreis_id}, {date}),\n".format(
                                  candidate_id=candidate_id, 
                                  stimmkreis_id=row["Schlüssel- nummer"], 
                                  date="'2023-10-08'")

            candidate_id += 1

    candidate_builder = candidate_builder[:-2] + ";"
    kandidiert_builder = kandidiert_builder[:-2] + ";"

    candidate_builder = candidate_builder.encode('utf-8', 'ignore')
    kandidiert_builder = kandidiert_builder.encode('utf-8', 'ignore')


    with open("kandidaten.sql", "wb") as file:
        file.write(candidate_builder)

    with open("kandidiertstimmkreis.sql", "wb") as file:
        file.write(kandidiert_builder)

            

get_candidates()