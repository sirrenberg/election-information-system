import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// returns a promise that resolves to an array of first names
function getFirstNames() {
  return new Promise((resolve, reject) => {
    fs.readFile("../misc/vornamen.csv", "utf16le", (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      const firstNames = data.split("\n").map((row) => row.split(",")[0]);
      resolve(firstNames);
    });
  });
}

function getLastNames() {
  return new Promise((resolve, reject) => {
    fs.readFile("../misc/nachnamen.txt", "latin1", (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      const rows = data.split("\n");
      const lastNames = rows.map((row) => row.split(",")[0]);
      resolve(lastNames);
    });
  });
}

function generateQueries() {
  getFirstNames().then((firstNames) => {
    let queryBuilder = "INSERT INTO first_names (name) VALUES\n";

    firstNames.forEach((name, index) => {
      queryBuilder += `('${name}')`;

      if (index < firstNames.length - 1) {
        queryBuilder += ",";
      }

      queryBuilder += "\n";
    });

    fs.writeFile("./firstNames.sql", queryBuilder, (err) => {
      if (err) {
        console.error(err);
      }
    });
  });

  getLastNames().then((lastNames) => {
    let queryBuilder = "INSERT INTO last_names (name) VALUES\n";
    lastNames.forEach((name, index) => {
      queryBuilder += `('${name}')`;

      if (index < lastNames.length - 1) {
        queryBuilder += ",";
      }

      queryBuilder += "\n";
    });

    fs.writeFile("./lastNames.sql", queryBuilder, (err) => {
      if (err) {
        console.error(err);
      }
    });
  });
}

generateQueries();
