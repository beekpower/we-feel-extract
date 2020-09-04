const Pool = require("pg").Pool;
const fs = require('fs');
// declare a new client instance from Pool()
const client = new Pool({
  host: "localhost",
  user: "postgres",
  database: "postgres",
  password: "MXXVIJhemFts",
  port: 5432
});
// declare constant for the table name
const tableName = "hourly";
// attempt to connect using the Pool
client.connect((err, client, done) => {
  // error handling for the client instance connection
  if (err) throw err;
  // SQL string that selects all records from a table
  const sqlQuery = `SELECT * FROM ${tableName} ORDER BY "timestamp" ASC`
  // pass SQL string and table name to query()
  client.query(sqlQuery, (err, res) => {
    if (err) return console.log("client.query()", err.stack)
    fs.writeFileSync('./output/postgres.json', JSON.stringify(res.rows, null, 2));
  });
});