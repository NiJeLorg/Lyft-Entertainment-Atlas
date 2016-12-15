'use strict';
// LOAD REQUIRED DEPENDENCIES //
// TO DO: pm2 is having trouble with the prot number coming from process.env.PORT, so hardcodin$
const express = require('express'),
    path = require('path'),
    //port = Number(process.env.PORT),
    port = Number(3000),
    app = express();


// SERVE STATIC FILES
app.use(express.static(path.join(__dirname, '/public/')));

// BASIC ROUTE
app.get('/atlas', function(req, res) {
    res.sendFile('index.html', {
        root: './public'
    });
});

// START THE SERVER
app.listen(port, function() {
    console.log('Server running on PORT: ' + port);
});
