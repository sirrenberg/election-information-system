# import pandas as pd

# # Specify the path to your CSV file
# csv_file_path = 'data/ltw_2023_stimmbezirksergebnisse.csv'

# # Read the CSV file into a DataFrame
# df = pd.read_csv(csv_file_path)

# print(df.columns)

# # Specify the column you want to modify
# column_to_modify = 'Schluessel'  # Replace 'YourColumnName' with the actual column name

# # Modify the column to include only the first three characters
# df[column_to_modify] = df[column_to_modify].map(lambda a: str(a)[0:3])

# # df['Schluessel'] = df['Schluessel'].map(lambda a: math.floor(a / 10000000000))

# df.to_csv("result", index=False)

import csv

# Specify the path to your CSV file
input_file_path = 'result.csv'
output_file_path = 'klammer.csv'

# Open the input file for reading
with open(input_file_path, 'r') as infile:
    # Read all lines from the file
    lines = infile.readlines()

# Surround each line with parentheses
lines_with_parentheses = ['(' + line.strip() + '),\n' for line in lines]

# Open the output file for writing
with open(output_file_path, 'w') as outfile:
    # Write the modified content to the output file
    outfile.writelines(lines_with_parentheses)

print(f"File '{input_file_path}' has been processed. Modified content saved to '{output_file_path}'.")

