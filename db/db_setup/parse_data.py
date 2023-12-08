import pandas as pd
import os
import math

# Provide the path to your Excel file
#excel_file_path = r'C:\election-information-system\db\data\08_10_2023_Landtagswahl_2023_Stimmkreise_Bayern.xlsx'

# Read the Excel file into a DataFrame
# df = pd.read_excel(excel_file_path)

# Global variable for inserted candidates
#TODO: This approach does not cover the case if there are two people with the same name and vorname
inserted_candidates = {}

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

#get_candidates()

def stimmen_pro_kandidat_per_sk_year(year):
    """
    Read data about zweitstimmen pro kandidat per stimmkreis for the year in parameter \n
    Create sql queries for erstimmen and zweitstimmen per kandidat pro stimmkreis \n
    SQL Queries stored in ./insert_queries folder\n
    """

    #First create the party table
    #party_id = create_party_table()

    with open("./insert_queries/kandidaten.sql", "wb") as file:
        sql = "INSERT INTO kandidaten VALUES \n"
        file.write(sql.encode('utf-8', 'ignore'))

    #Change i back to the original value, after testing
    for i in range(1, 8):
        erstimmen_file = f"./insert_queries/erststimmen_{year}/wk_90{i}.sql"
        zweitstimmen_file = f"./insert_queries/zweitstimmen_{year}/wk_90{i}.sql"

        with open(erstimmen_file, "wb") as erstimmen, open(zweitstimmen_file, "wb") as zweitstimmen:
            #Read data about wahlkreis with nummer i
            file_path = f"../data/clean_data_{year}/90{i}.xlsx"

            if(year == 2023):
                stimmen = read_sheets_and_create_query(file_path, '2023-10-08', year)
            elif(year==2018):
                stimmen = read_sheets_and_create_query(file_path, '2018-10-14', year)

            #Write insert queries to the files
            erstimmen_query = stimmen[0].encode('utf-8', 'ignore')
            zweitstimmen_query = stimmen[1].encode('utf-8', 'ignore')
            
            erstimmen.write(erstimmen_query)
            zweitstimmen.write(zweitstimmen_query)


def read_sheets_and_create_query(excel_file, date, year):
    """
    Read all sheets of an excel_file
    Create SQL Insert queries for kandidaten, kandidiert_erstimmen und kandidiert_zweitstimmen
    """
    data = pd.ExcelFile(excel_file)
    
    query_builder_erstimmen = f"INSERT INTO erstimmen_{year} VALUES \n"
    query_builder_zweitstimmen = f"INSERT INTO zweitstimmen_{year} VALUES \n"
    
    #Sheets in the files start with Sheet 1, Page 0, Page 1....
    #TODO: Sheet 1 is empty, fix it in clean_data.py
    #len(data.sheet_names)-1
    for i in range(0, len(data.sheet_names)-1):
        #Build current sheet name
        sheet = "Page " + str(i)

        print(sheet)
        #Read the current sheet
        current_sheet = pd.read_excel(excel_file, sheet_name=sheet)

        #Create sql insert query for each row in the current sheet, which has an candidate data
        for _, row in current_sheet.iterrows():
            #TODO: Clean unnecessary rows, to avoid the try catch workaround
            try:
                value= float(row['Id'])
                if(type(value) == float):
                    #The row contains candidate data
                    query_to_append = create_sql_insert_query(row, current_sheet.columns, date)
            
                    erstimmen = query_to_append[0]
                    zweitstimmen = query_to_append[1]

                    print(erstimmen)
                    print("---------------------")
                    print(zweitstimmen)

                    if(len(erstimmen) != 0):
                        query_builder_erstimmen += erstimmen
                        #query_builder_erstimmen += ",\n" 

                    if(len(zweitstimmen) != 0):
                        query_builder_zweitstimmen += zweitstimmen
                        #query_builder_zweitstimmen += ",\n"

            except ValueError:
                #Candidate Id is not a number, continue
                continue

    query_builder_erstimmen = query_builder_erstimmen[:-2] + ";"
    query_builder_zweitstimmen = query_builder_zweitstimmen[:-2] + ";"
    
    return [query_builder_erstimmen, query_builder_zweitstimmen]

#TODO: Should kandidates with 0 zweitstimmen be also included?
def create_sql_insert_query(df_row, df_cols, date):
    """
    Create SQL INSERT query for one row of the dataframe
    """
    kandidat_id = df_row['Id']
    kandidat_name = df_row['Name']
    kandidat_party = df_row['Partei']

    #TODO: Find a better way to create the kandidaten table
    if(kandidat_name not in inserted_candidates.keys()):
        #Kandidat not in the kandidaten table, should be added
        #For now add only (id, name, party)
        inserted_candidates[kandidat_name] = kandidat_id

        file_path = "./insert_queries/kandidaten.sql"
        with open(file_path, "ab") as file:
            entry = f"({kandidat_id}, '{kandidat_name}', '{kandidat_party}'),\n"
            query = entry.encode('utf-8', 'ignore')
            file.write(query)


    insert_values_erststimmen = ""
    insert_values_zweitstimmen = ""
    for i in range(4, len(df_row)):
        stimmkreis = df_cols[i]
        sk_nummer = stimmkreis[3:]
        
        zweitstimmen_str = str(df_row.iloc[i])
        
        #Replace '-' with '0' and the '.' thousand seperator with ''
        zweitstimmen_str = zweitstimmen_str.replace('-', '0')
        zweitstimmen_str = zweitstimmen_str.replace('.','')

        #Values with * relate to einzelstimmen, should be ignored
        if(zweitstimmen_str.find("*") == -1):
            #No *, then zweitstimmen  
            insert_values_zweitstimmen += f"({kandidat_id}, '{kandidat_name}', {sk_nummer}, {date}, {int(zweitstimmen_str)}),\n"    
        else:
            #*, then erstimmen, first remove the *
            zweitstimmen_str = zweitstimmen_str.replace('*', '')
            insert_values_erststimmen += f"({kandidat_id}, '{kandidat_name}', {sk_nummer}, {date}, {int(zweitstimmen_str)}),\n"

    return [insert_values_erststimmen, insert_values_zweitstimmen]


#-------------------------------------------------------------
# Helpers
#-------------------------------------------------------------
#Not currently used
def create_party_table():
    """
    Create SQL insert queries for all parties
    Return a dictionary with (id, party_name)
    """
    parties_2018 = ["Christlich-Soziale Union in Bayern e.V.", "Sozialdemokratische Partei Deutschlands", "FREIE WÄHLER Bayern", "BÜNDNIS 90/DIE GRÜNEN", "Freie Demokratische Partei", 
            "DIE LINKE", "Bayernpartei", "Ökologisch-Demokratische Partei", "Piratenpartei Deutschland", "Alternative für Deutschland", "Liberal-Konservative Reformer  Die EURO-Kritiker",
                "mut", "Partei der Humanisten", "Partei für Arbeit, Rechtsstaat, Tierschutz, Elitenförderung und basisdemokratische Initiative", "Partei für Gesundheitsforschung",
                    "PARTEI MENSCH UMWELT TIERSCHUTZ", "V-Partei³ - Partei für Veränderung, Vegetarier und Veganer", "Partei für Franken"]
        
    parties_2023 = ["Christlich-Soziale Union in Bayern e.V.", "BÜNDNIS 90/DIE GRÜNEN", "FREIE WÄHLER Bayern", "Alternative für Deutschland",
            "Sozialdemokratische Partei Deutschlands", "Freie Demokratische Partei", "DIE LINKE", "Bayernpartei", "Ökologisch-Demokratische Partei",
                "Partei für Arbeit, Rechtsstaat, Tierschutz, Elitenförderung und basisdemokratische Initiative", "PARTEI MENSCH UMWELT TIERSCHUTZ", 
                    "V-Partei³ - Partei für Veränderung, Vegetarier und Veganer", "Partei der Humanisten", "Basisdemokratische Partei Deutschland",
                    "Volt Deutschland"]
        
    parties = list(set(parties_2018 + parties_2023))
        
    party_id={}

    sql_query_builder = f"INSERT INTO parteien VALUES \n"
    for index, party in enumerate(parties, start=1):
        party_id[party] = index

        if(index != len(parties_2018)-1):
            sql_query_builder+=f"({index}, {party}),\n"
        else:
            sql_query_builder+=f"({index}, {party});\n"
    
    #Write the insert query to the ./insert_queries/parteien.sql
    file_path = "./insert_queries/parteiten.sql"
    with open(file_path, "wb") as file:
        file.write(sql_query_builder.encode('utf-8', 'ignore'))

    return party_id

#-------------------------------------------------------------
# Main
#-------------------------------------------------------------
if __name__ == '__main__':
    #stimmen_pro_kandidat_per_sk_year(2018)
    #stimmen_pro_kandidat_per_sk_year(2023)