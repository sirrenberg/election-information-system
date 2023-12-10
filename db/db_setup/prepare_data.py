from DataCleaner.DataCleaner import DataCleaner
from DataParser.DataParser import DataParser

import os
import shutil

import pandas as pd

#The script should
#Clean data
#Parse data (create SQL insert statements)
#Execute the SQL statements on the DB
def main():
    #Clean data for elections in 2018/2023
    #Takes quite a while, therefore files pushed
    #DataCleaner.clean_data_2023()
    #DataCleaner.clean_data_2018()

    #Create SQL insert queries for 2018 and 2023
    #DataParser.create_insert_queries(2023)
    #DataParser.create_insert_queries(2018)
    #DataParser.close_candidate_query()

    get_waehler_2023()

    #Merge SQL insert queries for easier manual execution
    #merge_queries()

#TODO: This should be improved
#TODO: Directory iteration should be done in another function
def merge_queries():
    erststimmen_2018 = os.path.join(".", "insert_queries", "erststimmen_2018") 
    erststimmen_2023 = os.path.join(".", "insert_queries", "erststimmen_2023")

    zweitstimmen_2018 = os.path.join(".", "insert_queries", "zweitstimmen_2018")
    zweitstimmen_2023 = os.path.join(".", "insert_queries", "zweitstimmen_2023")

    erststimmen = f"INSERT INTO kandidiert_erststimmen VALUES \n"
    zweitstimmen = f"INSERT INTO kandidiert_zweitstimmen VALUES \n"

    for file_name in os.listdir(erststimmen_2018):
        file_path = os.path.join(erststimmen_2018, file_name)

        with open(file_path, "r") as file:
            for index, line in enumerate(file):
                if index==0:
                    continue
                erststimmen+=line

        #Remove the ;
        erststimmen = erststimmen[:-1] + ",\n"

    for file_name in os.listdir(erststimmen_2023):
        file_path = os.path.join(erststimmen_2023, file_name)

        with open(file_path, "r") as file:
            for index, line in enumerate(file):
                if index==0:
                    continue
                erststimmen+=line

        #Remove the ;
        erststimmen = erststimmen[:-1] + ",\n"

    erststimmen = erststimmen[:-2] + ";\n"

    erststimmen_file_path = os.path.join(".", "insert_queries", "erststimmen.sql")
    with open(erststimmen_file_path, 'wb') as file:
        file.write(erststimmen.encode('utf-8', 'ignore'))


    for file_name in os.listdir(zweitstimmen_2018):
        file_path = os.path.join(zweitstimmen_2018, file_name)

        with open(file_path, "r") as file:
            for index, line in enumerate(file):
                if index==0:
                    continue
                zweitstimmen+=line

        #Remove the ;
        zweitstimmen = zweitstimmen[:-1] + ",\n"

    for file_name in os.listdir(zweitstimmen_2023):
        file_path = os.path.join(zweitstimmen_2023, file_name)

        with open(file_path, "r") as file:
            for index, line in enumerate(file):
                if index==0:
                    continue
                zweitstimmen+=line

        #Remove the ;
        zweitstimmen = zweitstimmen[:-1] + ",\n"

    zweitstimmen = zweitstimmen[:-2] + ";\n"

    zweitstimmen_file_path = os.path.join(".", "insert_queries", "zweitstimmen.sql")
    with open(zweitstimmen_file_path, 'wb') as file:
        file.write(zweitstimmen.encode('utf-8', 'ignore'))

    #Now all stimmen subfolders can be deleted
    shutil.rmtree(erststimmen_2018)
    shutil.rmtree(erststimmen_2023)
    
    shutil.rmtree(zweitstimmen_2018)
    shutil.rmtree(zweitstimmen_2023)

def get_waehler_2023():
    file_2023 = pd.read_excel(os.path.join("..", "data", "08_10_2023_Landtagswahl_2023_Stimmkreise_Bayern.xlsx"))
    #print(file_2023['Schlüssel- nummer'])
    #print(file_2023['Wähler'])

    df = pd.DataFrame({
    'stimmkreisid': file_2023['Schlüssel- nummer'],
    'datum': '2023-10-08',
    'anzahlWaehler': file_2023['Wähler']
    })

    waehler = "INSERT INTO anzahlWaehler VALUES \n"
    for index, row in df.iterrows():
        waehler += f"({row['stimmkreisid']}, '{row['datum']}', {row['anzahlWaehler']}),\n"

    waehler = waehler[:-2] + ";\n"

    file_path = os.path.join(".", "insert_queries", "waehler.sql")

    with open(file_path, mode='wb') as file:
        file.write(waehler.encode('utf-8', 'ignore'))

    print(waehler)

if __name__ == "__main__":
    main()