var express = require('express');
var fs = require('fs');
var request = require('request');
var expressapp = express();
var bodyParser = require('body-parser');
var exec = require('child_process').exec;
var dive = require('dive');

var fileUpload = require('express-fileupload');




// Needed for cloud sync functionality
var Firebase = require('firebase');

//Configuring middleware
expressapp.use(bodyParser())
expressapp.use(fileUpload());





var listValues = [];
var baseDir = '/photos/'; // this is the folder where the pages/apps live that are being managed


//Maps requests to the ./resources folder for static assets
expressapp.use(express.static(__dirname + '/resources'));


//Demo of Request to post a form
expressapp.post('/doPost', function(req, res){
    // console.log(req);

    var sampleFile;
 
    if (!req.files) {
        res.send('No files were uploaded.');
        return;
    }
 
    sampleFile = req.files.sampleFile;
    sampleFile.mv('/photos/filename.jpg', function(err) {
        if (err) {
            res.status(500).send(err);
        }
        else {
            res.send('File uploaded!');
        }
    });
    // console.log('pic: ' + req.params('pic'));

    // res.send('The post was successful: ' + req.param('username'));

})

//How to use the command line from the web
expressapp.get('/commandLine', function (req, res) {
    exec('curl https://www.google.com',
        function (error, stdout, stderr) {
        console.log('stdout: ' + stdout);
        res.send( stdout);
    });
})



//need to be able to store file structure as a global object
var refreshListValues = function () {
    listValues = [];
    dive(process.cwd() + baseDir, { recursive: false, directories: true, files: false }, function(err, dir) {
          if (err) throw err;
          listValues.push(dir.split(baseDir)[1]);
    }); 
}
refreshListValues(); //gets called when the app is loaded for the first time and any time a change to the file structure is changed


//returns an object that lists the file structure, 
expressapp.get('/list', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send({ 'files': listValues });
})

//endpoint for serving up the data that is needed to render a full view 
expressapp.get('/data', function(req, res) { 
    res.setHeader('Content-Type', 'application/json');
    var dataObj = {}
    // loop over each of the apps/folders and do a readfile on each of them
    for (var i=0; i < listValues.length; i++) {
        var file = fs.readFileSync('apps/' + listValues[i] + '/config.json', 'utf8');
        var newKey = listValues[i];
        dataObj[newKey] = JSON.parse(file);
    }
    res.send(dataObj);
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