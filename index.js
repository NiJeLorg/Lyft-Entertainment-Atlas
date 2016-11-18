'use strict';
// LOAD REQUIRED DEPENDENCIES //
const express = require('express'),
    path = require('path'),
    envVar = require('dotenv').config(),
    app = express();


// SERVE STATIC FILES
app.use(express.static(path.join(__dirname, '/public/')));

// BASIC ROUTE
app.get('/', function(req, res) {
    res.sendFile('index.html', {
        root: './public'
    });
});

// START THE SERVER
app.listen(envVar.PORT, function() {
    console.log('Server running on PORT: ' + envVar.PORT);
});
