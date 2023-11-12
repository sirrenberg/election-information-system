with open("data/stimmkreise.csv", "rw") as f:
    data = f.read().split("\n")

string_builder = "INSERT INTO stimmkreise VALUES"

for line in data:
    line = "(" + line + "),"

data = data.join("")

f.write(data)
