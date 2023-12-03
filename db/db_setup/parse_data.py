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


def zweitstimmen_pro_kandidat_per_sk():
    """
    Read data about zweitstimmen pro kandidat per stimmkreis
    Create the respective sql queries
    SQL Queries in the zweitstimmen_90*.sql files
    """
    with open("zweistimmen_wk_901.sql", "wb") as file:
        excel_file = r'C:\election-information-system\db\data\zweitstimmen\LTW2023_BEWERBER_UND_ABGEORDNETE_WkrNr_901.xls'
        file.write(read_sheets_and_create_query(excel_file))
    
    with open("zweistimmen_wk_902.sql", "wb") as file:
        excel_file = r'C:\election-information-system\db\data\zweitstimmen\LTW2023_BEWERBER_UND_ABGEORDNETE_WkrNr_902.xls'
        file.write(read_sheets_and_create_query(excel_file))
    
    with open("zweistimmen_wk_903.sql", "wb") as file:
        excel_file = r'C:\election-information-system\db\data\zweitstimmen\LTW2023_BEWERBER_UND_ABGEORDNETE_WkrNr_903.xls'
        file.write(read_sheets_and_create_query(excel_file))

    with open("zweistimmen_wk_904.sql", "wb") as file:
        excel_file = r'C:\election-information-system\db\data\zweitstimmen\LTW2023_BEWERBER_UND_ABGEORDNETE_WkrNr_904.xls'
        file.write(read_sheets_and_create_query(excel_file))

    with open("zweistimmen_wk_905.sql", "wb") as file:
        excel_file = r'C:\election-information-system\db\data\zweitstimmen\LTW2023_BEWERBER_UND_ABGEORDNETE_WkrNr_905.xls'
        file.write(read_sheets_and_create_query(excel_file))

    with open("zweistimmen_wk_906.sql", "wb") as file:
        excel_file = r'C:\election-information-system\db\data\zweitstimmen\LTW2023_BEWERBER_UND_ABGEORDNETE_WkrNr_906.xls'
        file.write(read_sheets_and_create_query(excel_file))

    with open("zweistimmen_wk_907.sql", "wb") as file:
        excel_file = r'C:\election-information-system\db\data\zweitstimmen\LTW2023_BEWERBER_UND_ABGEORDNETE_WkrNr_907.xls'
        file.write(read_sheets_and_create_query(excel_file))

def read_sheets_and_create_query(excel_file):
    """
    Read all sheets of an excel_file
    Always rename first two columns to (Id, Name)
    Create SQL Insert query
    """
    data = pd.ExcelFile(excel_file)
    sheet_number = len(data.sheet_names)
    sql_query_builder = "INSERT INTO kanditiertzweitstimmen VALUES \n"

    for i in range(1, sheet_number + 1):
        #Build current sheet name
        sheet = "Page " + str(i)

        #Read the current sheet and rename first two columns
        current_sheet_data = pd.read_excel(excel_file, sheet_name=sheet)
        current_sheet_data = rename_id_name_cols(current_sheet_data)

        #Create sql insert query for each row in the current sheet
        for _, row in current_sheet_data.iterrows():
            sql_query_builder += create_sql_insert_query(row, current_sheet_data.columns)
    

    sql_query_builder += ";"
    return sql_query_builder

#TODO: Didn't eliminate numbers with *, which is anzahl erstimmen
#TODO: Should be fixed!
def create_sql_insert_query(df_row, df_cols):
    """
    Create SQL INSERT query for one row of the dataframe
    """
    kandidat_id = df_row.iloc[0]
    kandidat_name = df_row.iloc[1]

    insert_values = []
    for i in range(2, len(df_row)):
        sk_nummer = df_cols[i]
        anz_zweitstimmen = df_row.iloc[i]

        insert_values.append(f"({kandidat_id}, '{kandidat_name}', {sk_nummer}, {anz_zweitstimmen})")
    
    return ',\n'.join(insert_values) + '\n'

def rename_id_name_cols(df):
    """
    Rename the (Unnamed: 0, Unnamed: 1) to (Id, Name)
    """
    return df.rename(columns={"Unnamed: 0": "Id", "Unnamed: 1": "Name"}, errors="raise")

#TODO: Should we execute here the function?
zweitstimmen_pro_kandidat_per_sk()