UPDATE kandidaten k
JOIN kanditiertzweitstimmen kzw ON k.kandidatennamen = kzw.kandidatennamen 
SET k.kandidatenid = kzw.id