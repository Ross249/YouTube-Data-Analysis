const sqlite3 = require("sqlite3").verbose();
const { databaseUrl } = require("./database.config");

const database = new sqlite3.Database(databaseUrl, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the database.");
});

module.exports = database;
