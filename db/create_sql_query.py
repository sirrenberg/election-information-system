import pandas as pd

# Specify the path to your CSV file
csv_file_path = './data/ltw_2018_stimmbezirksergebnisse.csv'

# Read the CSV file into a DataFrame
df = pd.read_csv(csv_file_path)

# Display the DataFrame
print(df.columns)
