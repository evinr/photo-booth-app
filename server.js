var express = require('express');
var fs = require('fs');
var request = require('request');
var expressapp = express();
var bodyParser = require('body-parser');
var exec = require('child_process').exec;
var dive = require('dive');
var fileUpload = require('express-fileupload'); // Not sure why removing this breaks upload ability



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
// No longer Needed
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


expressapp.get('/trigger', function(req, res) {
    // Data collection locally  should include the number of people present
    console.log('yep')
    var fileName = Date.now();
    exec('python' + __dirname + 'scripts/open-relay.py');

    const commandOptions = ['--capture-image-and-download', `--filename=${__dirname}/photos/${fileName}.jpeg`];
// const commandOptions = ['-l'];
    console.log(commandOptions)
    console.log(typeof commandOptions)
    const
        { spawn } = require( 'child_process' ),
        // gphoto2 = spawn('gphoto2', ['--capture-image-and-download', '--filename "/photos/aaa.jpeg"']);
        // spawn trips over " so it just removes them for you with no messaging 
        // gphoto2 = spawn('gphoto2', ['--capture-image-and-download']);
        gphoto2 = spawn('gphoto2', commandOptions);

        // gphoto2 = spawn(`'ls -l'`);


    let exitedError = false;

    gphoto2.stdout.on( 'data', data => {
        console.log( `stdout: ${data}` );
    } );

    gphoto2.stderr.on( 'data', data => {
        console.log( `stderr: ${data}` );
        // res.send('error');
        // cant set the response headers in here so just set a flag that gets checked on close
        exitedError = true;
    } );

    gphoto2.on( 'close', code => {
        console.log( `child process exited with code ${code}` );

        if (!exitedError) {
          res.send('okay')
        }
        else {
          res.status(404).send('error')
        }
        exec('python' + __dirname + 'scripts/close-relay.py');
        // add another script to ensure this is getting fired
    } );


    // exec('gphoto2 --capture-image-and-download --filename "/photos/rr.jpeg"')
    // exec(`gphoto2 --capture-image-and-download --filename "${__dirname}/photos/${fileName}.jpeg"`
    //     , (err, stdout, stderr) => {
    //   if (err) {
    //     // node couldn't execute the command
    //     // TODO: need to have fallback: need a queing for this
    //     res.status(404).send('error');
    //     return;
    //   }
    //   if (stdout) {
    //     // TODO: give a response that the capture group can know to release their pose
    //     res.send('I am the image');
    //     // turns off the lights
    //     exec('python scripts/close-relay.py');
    //   }
    //   else {
    //     res.send('I am the image');
    //     // turns off the lights
    //     exec('python scripts/close-relay.py');
    //   }


    //   // the *entire* stdout and stderr (buffered)
    //   console.log(`stdout: ${stdout}`);
    //   console.log(`stderr: ${stderr}`);
    // });

          

    // respond with the image so that it can be shown for a second
        // send the url of the image on disk?
    // res.send('I am the image');
})


//returns an object that lists the file structure, 
expressapp.get('/list', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send({ 'files': listValues });
    refreshListValues(); //make sure to refresh the list just incase anything outside the happy path is up-to-date
})

// TODO: Timelapse every hour
// this should really be a cron job
// exec(`gphoto2 --capture-image-and-download --filename "${__dirname}/timelapse/${fileName}.jpeg"`


//Sets up the listener for the express app
expressapp.listen('8081')



//Splash screen including the Node JS logo ascii art
console.log('................................................................................\n.....................................=====......................................\n..................................===========...................................\n...............................=================................................\n............................===========.===========.............................\n..........................==========.......==========...........................\n.......................===========...........===========........................\n....................===========.................===========.....................\n.................===========.......................===========..................\n...............==========.............................==========................\n............==========...................................==========.............\n.........===========.......................................===========..........\n.......==========.............................................==========........\n......========...................................................========.......\n......=====.........................................................=====.......\n......=====.........................................................=====.......\n......=====..............======........=================............=====.......\n......=====..............======......=====================..........=====.......\n......=====..............======....=========================........=====.......\n......=====..............======....======............=======........=====.......\n......=====..............======...======...............======.......=====.......\n......=====..............======...======................=====.......=====.......\n......=====..............======...========..........................=====.......\n......=====..............======....================.................=====.......\n......=====..............======.....======================..........=====.......\n......=====..............======........=====================........=====.......\n......=====..............======..............================.......=====.......\n......=====..............======........................=======......=====.......\n......=====..............======..======.................======......=====.......\n......=====..............======..======.................======......=====.......\n......=====..............======...======................======......=====.......\n......=====..............======...=========..........========.......=====.......\n......=====..............======.....========================........=====.......\n......=====..............======.......====================..........=====.......\n......=====..............======...........============..............=====.......\n......======.............======.....................................=====.......\n......========...........======..................................========.......\n.......==========........======...............................==========........\n.........===========...=======.............................===========..........\n............==================..........................===========.............\n...............==============.........................==========................\n..................========.........................==========...................\n................................................==========......................\n.............................=====...........===========........................\n...........................==========.....===========...........................\n.............................==========.==========..............................\n................................===============.................................\n...................................==========...................................\n.....................................=====......................................\n................................................................................\n');
console.log('          Photo Booth Platform Started at localhost:8081');

exports = module.exports = expressapp;