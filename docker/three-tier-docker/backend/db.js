const mysql = require("mysql2/promise");

const pool = mysql.createPool({
    host: "db",
    user: "root",
    password: "root",
    database: "taskdb",
    port: 3306
});

module.exports = pool;