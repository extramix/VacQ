const mysql = require("mysql");

var connection = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "24681012",
  database: "vacCenter",
});

module.exports = connection;
