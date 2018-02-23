var mysql = require('mysql');
module.exports = mysql.createConnection({
    host: 'localhost',
    user: 'sid',
    password: process.env.SECRET,
    database: 'projecthub_test'
    
});

