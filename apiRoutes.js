var express = require('express');
var apiRoutes = express.Router();
var jwt = require('jsonwebtoken');
var SECRET = 'qwerty123';
var connection = require('./db_config')

//authentication
apiRoutes.use( (req, res, next) => {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, SECRET, (err, decoded) => {
            if(err) return res.json({ success: false, message: "Failed to authenticate." }); 
            else {
                req.decoded = decoded;
                next();
            }
        })
    } else {
        return res.status(401).json({ success: false, message: 'No token provided.' });
    }    
} )

apiRoutes.get('/', (req, res) => {
    res.json({ success: true, message: 'Welcome to the api! See documentation for more info.' })
})
//get all usernames and user_id's
apiRoutes.get('/users', (req, res) => {
    connection.query('SELECT username, user_id FROM users', (err, results, fields) => {
        if (err) {
            res.json({ success: false, message: "An error occured!"});
            throw err;
        } else {
            //console.log(req.decoded);

            return res.status(200).json({ success: true, message: results })
        }
    })
})
//TODO: post messages, projects, etc. for users
apiRoutes.post('/create/project', (req, res) => {
    var projectName = req.body.projectName;
    var projectCode = req.body.projectCode;
    var projectOwnerId = req.decoded.user_id;
    //check if code is really unique against database
    connection.query(`INSERT into projects VALUES ('${projectName}', '${projectCode}', '${projectOwnerId}', NULL)`, (err, results) => {
        if (err) {
           throw err; 
        }
        connection.query(`INSERT into user_projects VALUES ('${projectOwnerId}', '${results['insertId']}')`)
        return res.json({ success: true, message: results });
    })    
})

apiRoutes.get('/projects/all', (req, res) => {
    connection.query('SELECT name, code from projects', (err, results) => {
        if (err) throw err;
        return res.json({ success: true, message: results })
    })
})

module.exports = apiRoutes;
