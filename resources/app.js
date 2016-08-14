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

	// // Trigger to take pic needs to get added after DOM is good
	document.getElementById('snap').addEventListener('click', function() {
		// need to do some binding or something I am too tired to deal with right now
		context.drawImage(video, 0, 0, 320, 240);
		uploadImage();
	});

}, false);


function uploadImage() {
    var xhr = new XMLHttpRequest();

    xhr.open('POST','/uploadImage',true);    
    var base64ImageValue = canvas.toDataURL('image/png')
 
    if(base64ImageValue) {
		var formdata = new FormData();
		formdata.append('pic',base64ImageValue);
		xhr.send(formdata);
	}
    xhr.onreadystatechange = function(){
    	if(xhr.readyState == 4 && xhr.status == 200) {
	             //some code
	             console.log('went through')
	    }
	};
}
