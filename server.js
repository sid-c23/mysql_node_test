//dependencies
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mysql = require('mysql');
var app = express();

var jwt = require('jsonwebtoken');
var PORT = process.env.PORT || 8080;

//database config
var connection = require('./db_config');

connection.connect();
/* test
connection.query('SELECT * FROM users', (err, res, fields) => {
    if( err ) throw err;
    for(i=0; i<res.length; i++) {
        console.log(res[i])
    }
})
*/
 
//middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(morgan('dev'));


var SECRET = 'qwerty123';

//routes
app.get('/', (req, res) => {
    res.status(200).json({ success: true, message: "Welcome!" });

})
app.post('/create/user', (req, res) => {
    var username = req.body.username;
    var passwordDigest = req.body.password;
    var email = req.body.email;
    //validate if username and email are really unique
    //requires another connection to the database 
    connection.query(`INSERT INTO users VALUES ('${username}', '${passwordDigest}', '${email}', NULL)`, (err, result) => {
        if(err) throw err;
        //create token
        connection.query(`SELECT user_id FROM users WHERE email='${email}'`, (err, results, fields) => {
            console.log(results[0].user_id) 
            const payload = {
                username: username,
                email: email,
                user_id: results[0].user_id
            }
            var token = jwt.sign(payload, SECRET, {
                expiresIn: '1h'
            })
            res.json({ success: true, message: "User successfully created!", token: token })

                
        })
        
    })
})

//protected routes
var apiRoutes = require('./apiRoutes');
app.use('/api', apiRoutes);

//server creation
app.listen(PORT);
console.log("Check http://localhost:" + PORT);
//connection.end();
