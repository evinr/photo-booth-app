var context; // Lazy/dumb hoisting

//Standarized the getUserMedia function across all of the different browsers
navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);

/** check if url is https or localhost and alert the user that we will not be able to access the microphone */
var audioCaptureInitializationCheck = function () {
	var url = window.location.href;
	var secureUrlIdentifier = 'https';
	var localhostIdentifier = 'localhost';

	if (url.indexOf(secureUrlIdentifier) === -1) {
		if (url.indexOf(localhostIdentifier) === -1){
			alert('Either need https or localhost to capture from the camera and microphone')
		}
		else {
			return true;
		}
	}
	else {
		return true;
	}
}



var captureImage = function	 () {

}

	// Put event listeners into place
window.addEventListener('DOMContentLoaded', function() {
	// Grab elements, create settings, etc.
	var canvas = document.getElementById('canvas'),
		video = document.getElementById('video'),
		videoObj = { 'video': true },
		errBack = function(error) {
			console.log('Video capture error: ', error.code); 
		};
		context = canvas.getContext('2d');


	navigator.getUserMedia(videoObj, function(stream) {
		video.src = window.URL.createObjectURL(stream); // || stream // who even uses stream, IE? lol; 
		video.play();
	}, errBack);

	// // Trigger to take pic
	document.getElementById('snap').addEventListener('click', function() {
		// need to do some binding or something I am too tired to deal with right now
		context.drawImage(video, 0, 0, 320, 240);
		uploadImage();
	});

}, false);

// // Trigger photo take
// document.getElementById('snap').addEventListener('click', function() {
// 	context.drawImage(video, 0, 0, 320, 240);

// Converts canvas to an image
function convertCanvasToImage(canvas) {
	var image = new Image();
	image.src = canvas.toDataURL("image/png");
	return image;
}

function uploadImage() {
	console.log('asdf')
    var xhr = new XMLHttpRequest();

    xhr.open("POST","/doPost",true);    

    var file = convertCanvasToImage(canvas);
    if(file) {
		var formdata = new FormData();
		formdata.append("pic",file);
		xhr.send(formdata);
	}
    xhr.onreadystatechange = function(){
    	if(xhr.readyState == 4 && xhr.status == 200) {
	             //some code
	             console.log('went through')
	    }
	};
}

document.addEventListener('keydown', function(event) {
		if (event.keyCode == 37) {
			context.drawImage(video, 0, 0, 320, 240);
			// TODO: Make XHR request to backend with image file or base64 string
		}
		if (event.keyCode == 39) {
			context.drawImage(video, 0, 0, 320, 240);
		}
	}, true);