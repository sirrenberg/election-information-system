import warnings
warnings.simplefilter(action='ignore', category=FutureWarning)

import pandas as pd
import os


class DataCleaner:
    #Class attributes, hardcoded list of parties for the election in 2018 and 2023
    parties_2018 = ["Christlich-Soziale Union in Bayern e.V.", "Sozialdemokratische Partei Deutschlands", "FREIE WÄHLER Bayern", "BÜNDNIS 90/DIE GRÜNEN", "Freie Demokratische Partei", 
        "DIE LINKE", "Bayernpartei", "Ökologisch-Demokratische Partei", "Piratenpartei Deutschland", "Alternative für Deutschland", "Liberal-Konservative Reformer  Die EURO-Kritiker",
            "mut", "Partei der Humanisten", "Partei für Arbeit, Rechtsstaat, Tierschutz, Elitenförderung und basisdemokratische Initiative", "Partei für Gesundheitsforschung",
                "PARTEI MENSCH UMWELT TIERSCHUTZ", "V-Partei³ - Partei für Veränderung, Vegetarier und Veganer", "Partei für Franken"]

    parties_2023 = ["Christlich-Soziale Union in Bayern e.V.", "BÜNDNIS 90/DIE GRÜNEN", "FREIE WÄHLER Bayern", "Alternative für Deutschland",
        "Sozialdemokratische Partei Deutschlands", "Freie Demokratische Partei", "DIE LINKE", "Bayernpartei", "Ökologisch-Demokratische Partei",
            "Partei für Arbeit, Rechtsstaat, Tierschutz, Elitenförderung und basisdemokratische Initiative", "PARTEI MENSCH UMWELT TIERSCHUTZ", 
            "V-Partei³ - Partei für Veränderung, Vegetarier und Veganer", "Partei der Humanisten", "Basisdemokratische Partei Deutschland",
                "Volt Deutschland"]

    @staticmethod
    def clean_data_2018():
        #Create Excel files for the cleaned data
        empty_df = pd.DataFrame()

        #Create data folder, if necessary
        os.makedirs(os.path.join("..", "data", "clean_data_2018"))

        #Save the empty DataFrame to an Excel file
        for i in range (1, 8):
            file_path = os.path.join("..", "data", "clean_data_2018", f"90{i}.xlsx")
            empty_df.to_excel(file_path, index=False)

        DataCleaner.iterate_over_sheets(os.path.join("..", "data", "data_2018", "BewerberNachStimmkreisen_901_3010_120946813.xls"),
                                           1, DataCleaner.parties_2018, 2018)
        
        DataCleaner.iterate_over_sheets(os.path.join("..", "data", "data_2018", "BewerberNachStimmkreisen_902_3010_120949031.xls"),
                                        2, DataCleaner.parties_2018, 2018)
        
        
        DataCleaner.iterate_over_sheets(os.path.join("..", "data","data_2018", "BewerberNachStimmkreisen_903_3010_120951000.xls"),
                                        3, DataCleaner.parties_2018, 2018)
    
        DataCleaner.iterate_over_sheets(os.path.join("..", "data", "data_2018", "BewerberNachStimmkreisen_904_3010_120953304.xls"),
                                        4, DataCleaner.parties_2018, 2018)
        
        DataCleaner.iterate_over_sheets(os.path.join("..", "data", "data_2018", "BewerberNachStimmkreisen_905_3010_120956931.xls"),
                                        5, DataCleaner.parties_2018, 2018)
       
        DataCleaner.iterate_over_sheets(os.path.join("..", "data", "data_2018", "BewerberNachStimmkreisen_906_3010_120959690.xls"),
                                        6, DataCleaner.parties_2018, 2018)

        DataCleaner.iterate_over_sheets(os.path.join("..", "data", "data_2018", "BewerberNachStimmkreisen_907_3010_121003563.xls"),
                            7, DataCleaner.parties_2018, 2018)

    @staticmethod
    def clean_data_2023():
        #Create Excel files for the cleaned data
        empty_df = pd.DataFrame()

        #Create data folder, if necessary
        os.makedirs(os.path.join("..", "data", "clean_data_2023"))

        #Save the empty DataFrame to an Excel file
        for i in range (1, 8):
            file_path = os.path.join("..", "data", "clean_data_2023", f"90{i}.xlsx")
            print(f"Created: {file_path}")
            empty_df.to_excel(file_path, index=False)

        for i in range(1, 8):
            file_path = os.path.join("..", "data", "data_2023", f"LTW2023_BEWERBER_UND_ABGEORDNETE_WkrNr_90{i}.xls")
            DataCleaner.iterate_over_sheets(file_path, i, DataCleaner.parties_2023, 2023)

    @staticmethod
    def iterate_over_sheets(file_path,wk_index, parties, year):
        sheet_index = 0
        excel_file = pd.ExcelFile(file_path)
        sheet_number = len(excel_file.sheet_names)

        for i in range(1,sheet_number+1):
            sheet_name = f"Page {i}"
            df_sheet = pd.read_excel(file_path, sheet_name=sheet_name)

            #Extract the stimmkreis nummer
            stimmkreise_nummern = DataCleaner.find_stimmkreis_nummer(df_sheet)

            num_cols= len(df_sheet.columns)
            
            #Determine row indices, where candidates of a new party start
            indices = DataCleaner.find_row_index_party(df_sheet, parties)
            start_index2 = len(df_sheet.columns) - len(stimmkreise_nummern)

            for i in range(0, len(indices)):
                if(i==len(indices)-1):
                    df_subframe = df_sheet.iloc[indices[i]:, :]

                    cleaned_df = DataCleaner.modify_df(df_subframe, start_index2, stimmkreise_nummern, num_cols)

                    with pd.ExcelWriter(os.path.join("..", "data", f"clean_data_{year}", f"90{wk_index}.xlsx"),
                                         mode='a', engine='openpyxl') as writer:
                        cleaned_df.to_excel(writer, sheet_name=f'Page {sheet_index}')

                    sheet_index+=1       
                else:
                    start_index = indices[i]
                    end_index=indices[i+1]-1
                    df_subframe = df_sheet.iloc[start_index:end_index, :]

                    cleaned_df = DataCleaner.modify_df(df_subframe, start_index2, stimmkreise_nummern,num_cols)
        
                    with pd.ExcelWriter(os.path.join("..", "data", f"clean_data_{year}", f"90{wk_index}.xlsx"),
                                         mode='a', engine='openpyxl') as writer:
                        cleaned_df.to_excel(writer, sheet_name=f'Page {sheet_index}')
            
                    sheet_index+=1
        print(f"Successful cleaning of {file_path}")

#----------------------------------------------------
#Helpers
#----------------------------------------------------
    @staticmethod
    def modify_df(df, start_index, stimmkreise_nummern, num_cols):
        """
        start_index -> col_index, where data about the number of votes per sk starts
        num_cols -> number of columns in the initial data_sheet
        stimmkreise_nummern -> all stimmkreise nummern in the data_sheet
        """
        #Drop NaN rows
        df = df.dropna(axis='index', how='all')
        
        #Select the first three columns
        #They contain (Kandidat_Id, Name, Partei)
        df_subframe1 = df.iloc[:, :3]

        #Choose all other columns, containing data about number of votes per sk
        df_subframe2 = df.iloc[:, start_index:]

        result_df = df_subframe1.join(df_subframe2)
        
        #Rename columns and add party to candidates
        result_df = DataCleaner.rename_cols(result_df, stimmkreise_nummern, num_cols)
        result_df = DataCleaner.add_party_to_candidates(result_df)

        #Drop last three rows, contain only aggregated data
        #Skip this step
        #result_df.drop(result_df.tail(3).index, inplace=True)
        #result_df = result_df[result_df['Id'].str.isdigit()==True]

        return result_df

    @staticmethod
    def rename_cols(df, stimmkreise_nummern, num_cols):
        """
        Rename the following columns:
            1. "Unnamed: 0" -> "Id"
            2. "Noch 1. Ergebnisse..." -> "Partei"
            3. "Unnamed: 2" -> "Name"
            3. "Unnamed: {i}" -> Sk_{i}
        """
        second_col_name = df.columns[1]
        df = df.rename(columns={'Unnamed: 0': 'Id', 
                            #'Noch: 1. Ergebnisse der Landtagswahl 2018 in Bayern für die einzelnen Bewerber nach Stimmkreisen':'Partei',
                            second_col_name: 'Partei',
                            'Unnamed: 2': 'Name'})

        old_col_index = num_cols - 1
        for i in range(len(stimmkreise_nummern)-1, -1, -1):
            old_col_name = f'Unnamed: {old_col_index}'
            sk_nummer = stimmkreise_nummern[i]
            new_col_name = f'Sk_{sk_nummer}'
            
            df = df.rename(columns={old_col_name: new_col_name})
            old_col_index -= 1

        return df

    @staticmethod
    def add_party_to_candidates(df):
        #Party name contained only in the first row
        party_name = df.iloc[0, 1]
        
        #Add party to each candidate row
        df['Partei'] = party_name

        #Drop the first row, contains only party name
        df = df.iloc[1:]
        return df

    @staticmethod
    def find_stimmkreis_nummer(df):
        """
        Find the row, where stimmkreis nummers are stored
        This row is always below the row with "stimmkreis" in it 
        """
        searched_index = -1
        for index, row in df.iterrows():
            if(row.str.contains("Stimmkreis").any()):
                searched_index = index+1
                break
        return df.iloc[searched_index].dropna()

    @staticmethod
    def find_row_index_party(df, parties):
        """
        Find the rows indices where a party name is found
        Hardcoded party list required
        Candidate data starts always one row below
        """
        number_of_cols = len(df.columns)
        indices = []
        for index, row in df.iterrows():
            count_na_values = row.isna().sum()
            if(count_na_values == number_of_cols - 1):
                for party in parties:
                    if(row.str.contains(party).any()):
                        indices.append(index)
                        break
        return indices

    @staticmethod
    def modify_df(df, start_index, stimmkreise_nummern, num_cols):
        """
        start_index -> col_index, where data about the number of votes per sk starts
        num_cols -> number of columns in the initial data_sheet
        stimmkreise_nummern -> all stimmkreise nummern in the data_sheet
        """
        #Drop NaN rows
        df = df.dropna(axis='index', how='all')
        
        #Select the first three columns
        #They contain (Kandidat_Id, Name, Partei)
        df_subframe1 = df.iloc[:, :3]

        #Choose all other columns, containing data about number of votes per sk
        df_subframe2 = df.iloc[:, start_index:]

        result_df = df_subframe1.join(df_subframe2)
        
        #Rename columns and add party to candidates
        result_df = DataCleaner.rename_cols(result_df, stimmkreise_nummern, num_cols)
        result_df = DataCleaner.add_party_to_candidates(result_df)

        return result_df