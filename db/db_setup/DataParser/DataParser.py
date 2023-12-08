import os
import pandas as pd
import math

class DataParser: 
    #Class attributes, inserted candidates should keep track which candidates have been already inserted
    #Key is candidate_id, value is candidate_name
    inserted_candidates = {}

    #TODO: Added also the parties relevant for the elections in 2018?
    parties = party_dictionary = {
    'Christlich-Soziale Union in Bayern e.V.': 1,
    'BÜNDNIS 90/DIE GRÜNEN': 2,
    'FREIE WÄHLER Bayern': 3,
    'Alternative für Deutschland': 4,
    'Sozialdemokratische Partei Deutschlands': 5,
    'Freie Demokratische Partei': 6,
    'DIE LINKE': 7,
    'Bayernpartei': 8,
    'Ökologisch-Demokratische Partei': 9,
    'Partei für Arbeit, Rechtsstaat, Tierschutz, Elitenförderung und basisdemokratische Initiative': 10,
    'PARTEI MENSCH UMWELT TIERSCHUTZ': 11,
    'V-Partei³ - Partei für Veränderung, Vegetarier und Veganer': 12,
    'Partei der Humanisten': 13,
    'Basisdemokratische Partei Deutschland': 14,
    'Volt Deutschland': 15,
    'Sonstige': 16,
    # Commented parties without IDs
    'Piratenpartei Deutschland': 17,
    'Partei für Franken': 18,
    'Liberal-Konservative Reformer \x96 Die EURO-Kritiker': 19,
    'mut': 20,
    'Partei für Gesundheitsforschung': 21
}

    @staticmethod
    def create_insert_queries(year):
        """
        Read data about zweitstimmen pro kandidat per stimmkreis for the year in parameter \n
        Create sql queries for erstimmen and zweitstimmen per kandidat pro stimmkreis \n
        SQL Queries stored in ./insert_queries folder\n
        """
        
        kandidaten_file = os.path.join(".", "insert_queries", f"kandidaten.sql")
        
        if not os.path.exists(kandidaten_file):
            with open(kandidaten_file, "wb") as file:
                sql = f"INSERT INTO kandidaten VALUES \n"
                file.write(sql.encode('utf-8', 'ignore'))

        #Create the required subdirectories
        os.makedirs(os.path.join(".", "insert_queries", f"erststimmen_{year}"), exist_ok=True)

        os.makedirs(os.path.join(".", "insert_queries", f"zweitstimmen_{year}"), exist_ok=True)

        for i in range(1, 8):
            erstimmen_file = os.path.join(".", "insert_queries", f"erststimmen_{year}", f"wk_90{i}.sql")
            
            zweitstimmen_file = os.path.join(".", "insert_queries", f"zweitstimmen_{year}", f"wk_90{i}.sql")

            with open(erstimmen_file, "wb") as erstimmen, open(zweitstimmen_file, "wb") as zweitstimmen:
                #Read data about wahlkreis with nummer i
                file_path = os.path.join("..", "data", f"clean_data_{year}", f"90{i}.xlsx")

                if(year == 2023):
                    stimmen = DataParser.read_sheets_and_create_query(file_path, '2023-10-08', year ,900 + i)
                elif(year==2018):
                    stimmen = DataParser.read_sheets_and_create_query(file_path, '2018-10-14', year, 900 + i)

                #Write insert queries to the files
                erstimmen_query = stimmen[0].encode('utf-8', 'ignore')
                zweitstimmen_query = stimmen[1].encode('utf-8', 'ignore')
                
                erstimmen.write(erstimmen_query)
                zweitstimmen.write(zweitstimmen_query)
            
            print(f"Successfully created insert queries for Wahlkreis {i} for {year}")

    @staticmethod
    def read_sheets_and_create_query(excel_file, date, year, wk_nummer):
        """
        Read all sheets of an excel_file
        Create SQL Insert queries for kandidaten, kandidiert_erstimmen und kandidiert_zweitstimmen
        """
        data = pd.ExcelFile(excel_file)
        
        query_builder_erstimmen = f"INSERT INTO kandidiert_erststimmen VALUES \n"
        query_builder_zweitstimmen = f"INSERT INTO kandidiert_zweitstimmen VALUES \n"
        
        #Sheets in the files start with Sheet 1, Page 0, Page 1....
        #TODO: Sheet 1 is empty, fix it in DataCleaner
        for i in range(0, len(data.sheet_names)-1):
            #Build current sheet name
            sheet = "Page " + str(i)

            #Read the current sheet
            current_sheet = pd.read_excel(excel_file, sheet_name=sheet)

            #Create sql insert query for each row in the current sheet, which has an candidate data
            for _, row in current_sheet.iterrows():
                #TODO: Clean unnecessary last rows, to avoid the try catch workaround
                try:
                    value= float(row['Id'])
                    if(type(value) == float and not math.isnan(value)):
                        #The row contains candidate data
                        query_to_append = DataParser.create_sql_insert_query(row, current_sheet.columns, date, wk_nummer)
                
                        erstimmen = query_to_append[0]
                        zweitstimmen = query_to_append[1]

                        if(len(erstimmen) != 0):
                            query_builder_erstimmen += erstimmen

                        if(len(zweitstimmen) != 0):
                            query_builder_zweitstimmen += zweitstimmen

                except ValueError:
                    #Candidate Id is not a number, continue
                    continue

        query_builder_erstimmen = query_builder_erstimmen[:-2] + ";"
        query_builder_zweitstimmen = query_builder_zweitstimmen[:-2] + ";"
        
        return [query_builder_erstimmen, query_builder_zweitstimmen]

    @staticmethod
    def create_sql_insert_query(df_row, df_cols, date, wk_nummer):
        """
        Create SQL INSERT query for one row of the dataframe
        """
        old_kandidat_id = df_row['Id']
        
        #Escape '
        kandidat_name = df_row['Name'].replace("'", "''")
    
        kandidat_party = df_row['Partei']

        #Get the id of the party
        party_id = DataParser.parties[kandidat_party]

        #Kandidaten Id's in the initial data sheets not unique
        #Create the id by appending wk_nummer in front of the kandidat_id and 
        new_kandidat_id = str(wk_nummer) + str(old_kandidat_id)
        new_kandidat_id = new_kandidat_id.replace(".0", "")

        if(new_kandidat_id not in DataParser.inserted_candidates.keys()):
            #TODO: Could also be done with simple array
            DataParser.inserted_candidates[new_kandidat_id] = kandidat_name

            file_path = os.path.join(".", "insert_queries", f"kandidaten.sql")
            with open(file_path, "ab") as file: 
                entry = f"({new_kandidat_id}, '{kandidat_name}', {party_id}),\n"
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

            #Values with * are erststimmen, and without are zweitstimmen
            if(zweitstimmen_str.find("*") == -1):
                #No *, then zweitstimmen  
                insert_values_zweitstimmen += f"({new_kandidat_id}, {sk_nummer}, '{date}', {int(zweitstimmen_str)}),\n"    
            else:
                #*, then erstimmen, first remove the *
                zweitstimmen_str = zweitstimmen_str.replace('*', '')

                insert_values_erststimmen += f"({new_kandidat_id}, {sk_nummer}, '{date}', {int(zweitstimmen_str)}),\n"

        return [insert_values_erststimmen, insert_values_zweitstimmen]
    
    @staticmethod
    def close_candidate_query():
        kandidaten_file = os.path.join(".", "insert_queries", "kandidaten.sql")

        # Read the content from the file
        with open(kandidaten_file, 'r') as file:
            content = file.read()

        modified_content = content[:-2] + ";"

        with open(kandidaten_file, 'w') as file:
            file.write(modified_content)


