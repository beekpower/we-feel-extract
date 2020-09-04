const Pool = require("pg").Pool;
const converter = require('json-2-csv');
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
const tableName = "hourly"

// attempt to connect using the Pool
client.connect((err, client, done) => {

    // error handling for the client instance connection
    if (err) throw err;

    // SQL string that selects all records from a table
    const sqlQuery = `SELECT * FROM ${tableName}`

    // pass SQL string and table name to query()
    client.query(sqlQuery, (err, res) => {

        if (err) {
           console.log("client.query()", err.stack)
        }
     
        fs.writeFileSync('./postgres.json',  JSON.stringify(res.rows, null, 2));
        // // convert JSON array to CSV string
        // converter.json2csv(jsonData, (err, csv) => {
        //     if (err) {
        //         throw err;
        //     }
        
        //     fs.writeFileSync('./postgres.json',csv);

        // });


    })
})