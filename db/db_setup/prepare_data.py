from DataCleaner.DataCleaner import DataCleaner
from DataParser.DataParser import DataParser


import os

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
    DataParser.create_insert_queries(2023)
    DataParser.create_insert_queries(2018)
    DataParser.close_candidate_query()

if __name__ == "__main__":
    main()