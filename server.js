var express = require('express');
var fs = require('fs');
var request = require('request');
var expressapp = express();
var bodyParser = require('body-parser');
var exec = require('child_process').exec;
var dive = require('dive');

var fileUpload = require('express-fileupload'); // Not sure why removing this breaks upload ability

//SSL Requirements
// var http = require('http');
// var https = require('https');
// var privateKey  = fs.readFileSync('sslcert/server.key', 'utf8');
// var certificate = fs.readFileSync('sslcert/server.crt', 'utf8');

// var credentials = {key: privateKey, cert: certificate};
// var express = require('express');
// var app = express();

// // your express configuration here
// var httpServer = http.createServer(expressapp);
// var httpsServer = https.createServer(credentials, expressapp);

// httpServer.listen(8081);
// httpsServer.listen(8443);



// Needed for cloud sync functionality
// var Firebase = require('firebase');

//Configuring middleware
expressapp.use(bodyParser())
expressapp.use(fileUpload());


var listValues = []; // this needs to be global because trying to do it async is tricky since it is the command line
var baseDir = __dirname + '/photos/'; // this is the folder where the pages/apps live that are being managed


//Maps requests to the ./resources folder for static assets
expressapp.use(express.static(__dirname + '/resources'));
//Maps to the images that get captured
expressapp.use('/images', express.static(baseDir));

//Endpoint for uploading an image via POST as a base-64 string
expressapp.post('/uploadImage', function(req, res){
    var image = req.param('pic');
    var fileName = Date.now();
    var data = image.replace(/^data:image\/\w+;base64,/, '');

    fs.writeFile(__dirname + '/photos/' + fileName + '.png', data, {encoding: 'base64'}, function(err){});
    res.send('The post was successful');
    // reset the list of images in the for the frontend API
    refreshListValues();
})


//Endpoint for uploading an image via POST as a base-64 string
expressapp.post('/uploadEmail', function(req, res){
    var email = req.param('email');
    var image = req.param('image');
    var timeStamp = Date.now();

    var obj = { 'email': email, 'image': image, 'time': timeStamp };

    var file = JSON.parse(fs.readFileSync('emails.json', 'utf8'));
    file.push(obj)
    var dataToWrite = JSON.stringify(file, null, 4);
    fs.writeFileSync('emails.json', dataToWrite, 'utf8');

    res.send('The post was successful');
    // reset the list of images in the for the frontend API
    refreshListValues();
})

//need to be able to store file structure as a global object
var refreshListValues = function () {
    listValues = [];
    dive(baseDir, { recursive: false, directories: false, files: true }, function(err, dir) {
          if (err) throw err;
          listValues.push(dir.split(baseDir)[1]);
    }); 
};
//gets called when the app is loaded for the first time and any time a change to the file structure is changed
refreshListValues(); 


//returns an object that lists the file structure, 
expressapp.get('/list', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send({ 'files': listValues });
    refreshListValues(); //make sure to refresh the list just incase anything outside the happy path is up-to-date
})




// // Firebase demo
// expressapp.get('/fireset', function(req, res) {
//     var dataRef = new Firebase('https://testmcdemo.firebaseio.com/');
//     dataRef.set({"stuff":{"junk":"hello world!","more":"asdfasdfasdf"}});
//     //send confirmation it was set
//     res.send('data was set!');
// })

// expressapp.get('/fireget', function(req, res) {
//         var dataRef = new Firebase('https://testmcdemo.firebaseio.com/');
//     dataRef.child("stuff/more").on("value", function(snapshot) {
//         //          ^^^ path to the data
//   res.send(snapshot.val());  // Alerts "San Francisco"
// });
// })

//Sets up the listener for the express app
expressapp.listen('8081')



//Splash screen including the Node JS logo ascii art
console.log('................................................................................\n.....................................=====......................................\n..................................===========...................................\n...............................=================................................\n............................===========.===========.............................\n..........................==========.......==========...........................\n.......................===========...........===========........................\n....................===========.................===========.....................\n.................===========.......................===========..................\n...............==========.............................==========................\n............==========...................................==========.............\n.........===========.......................................===========..........\n.......==========.............................................==========........\n......========...................................................========.......\n......=====.........................................................=====.......\n......=====.........................................................=====.......\n......=====..............======........=================............=====.......\n......=====..............======......=====================..........=====.......\n......=====..............======....=========================........=====.......\n......=====..............======....======............=======........=====.......\n......=====..............======...======...............======.......=====.......\n......=====..............======...======................=====.......=====.......\n......=====..............======...========..........................=====.......\n......=====..............======....================.................=====.......\n......=====..............======.....======================..........=====.......\n......=====..............======........=====================........=====.......\n......=====..............======..............================.......=====.......\n......=====..............======........................=======......=====.......\n......=====..............======..======.................======......=====.......\n......=====..............======..======.................======......=====.......\n......=====..............======...======................======......=====.......\n......=====..............======...=========..........========.......=====.......\n......=====..............======.....========================........=====.......\n......=====..............======.......====================..........=====.......\n......=====..............======...........============..............=====.......\n......======.............======.....................................=====.......\n......========...........======..................................========.......\n.......==========........======...............................==========........\n.........===========...=======.............................===========..........\n............==================..........................===========.............\n...............==============.........................==========................\n..................========.........................==========...................\n................................................==========......................\n.............................=====...........===========........................\n...........................==========.....===========...........................\n.............................==========.==========..............................\n................................===============.................................\n...................................==========...................................\n.....................................=====......................................\n................................................................................\n');
console.log('          Node Express Server Demo Platform Started at localhost:8081');

exports = module.exports = expressapp;