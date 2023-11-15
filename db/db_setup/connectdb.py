import psycopg2

# Connection parameters
db_params = {
    'host': 'localhost',
    'database': 'electiondb',
    'user': 'myuser',
    'password': 'mypassword',
    'port': '5432'  # typically 5432
}

# Establish a connection to the database
conn = psycopg2.connect(**db_params)

# Create a cursor object to interact with the database
cur = conn.cursor()

# Example: Execute a query
cur.execute("SELECT version();")

# Fetch the result
db_version = cur.fetchone()
print("PostgreSQL database version:", db_version)

# Close communication with the database
cur.close()
conn.close()
