var numberOfElements;
var data; 

function loadData() {
	var targetUrl = '/list';
    var xhttp;
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
       		renderData(JSON.parse(xhttp.responseText)) //TODO: Version this for backwards compatability
            
            // removes the loading animation
            var child = document.getElementsByClassName('loader')[0];
			document.body.removeChild(child);
        }
    }
    xhttp.open('GET', targetUrl, true);
    xhttp.send();
}


function updateListener (targetId) {
	var targetField = targetId.split('-')[0];
	var targetElementNumber = parseFloat(targetId.split('-')[1]);
	
	if (targetField === 'close') {
		closeLightbox();
	}

	if (targetField === 'menu') {
		launchLightbox();
		renderLightbox(targetElementNumber);
	}

	if (targetField === 'next') {
		renderLightbox(targetElementNumber + 1);
	}

	if (targetField === 'prev') {
		renderLightbox(targetElementNumber - 1);
	}


	// Web App Basics 
	if (targetField === 'new') {
		createNewInstance();
	}

	if (targetField === 'save') {
		saveQuestionToInstance(targetId);
	}

	if (targetField === 'browse') {
		// TODO: Retrieve all of the instances from the device/cloud
		// TODO: Render results to the lightbox
	}

	if (targetField === 'share') {
		// TODO: Create a way to share via a hashmap or string
		
	}

}

function launchLightbox() {
	//launch the modal
	var modal = document.getElementsByClassName('modalDialog')[0];
	modal.className += ' modalDialog-active';
	// add event listener for escape key to close
	document.addEventListener('keydown', function(event) {
		if (event.keyCode == 27) {
			closeLightbox();
		}
		if (event.keyCode == 37) {
			var prevButton = document.getElementsByClassName('prev')[0];
			renderLightbox(parseFloat(prevButton.id.split('-')[1]) - 1);
		}
		if (event.keyCode == 39) {
			var nextButton = document.getElementsByClassName('next')[0];
			renderLightbox(parseFloat(nextButton.id.split('-')[1]) + 1);
		}
	}, true);
}

function closeLightbox () {
	var modal = document.getElementsByClassName('modalDialog')[0];
	modal.className = 'modalDialog';
}

function createNewInstance () {
	console.log('NEEDS TO BE IMPLEMENTED')
	// TODO: Create a random GUID and attach a name format of name-yyyy-mm-dd

	//TODO: Collect from the lightbox

	//TODO: Create UI element to kick off this function
}

function saveQuestionToInstance () {
	console.log('NEEDS TO BE IMPLEMENTED')
	// TODO: Add an animation with a star doing something cool
	// TODO: Save the key/target id and add some checking on the version
	// 
}

function renderLightbox(target) {
	// check to see if we need to loop based on numberOfElements
	if ( target === -1) {
		target = data.length - 1;
	}
	else if (target === data.length -1) {
		target = 0;
	}

	// clean the section
	var parentElem = document.getElementById('modalViewPage');
	var childElem = document.getElementById('viewPageWrapper');
	parentElem.removeChild(childElem);
	
	// create a new viewPageWrapper element
	var viewPageParent = document.getElementById('modalViewPage');
	var childSection = document.createElement('section');
	childSection.id = 'viewPageWrapper';
	viewPageParent.appendChild(childSection);

	// add elements to the lightbox 
	var viewPageElement = document.getElementById('viewPageWrapper');

	// email address collection form

	// TODO: Make this a dropdown for an easy way to switch categories
	var category = document.createElement('p');
	category.appendChild(document.createTextNode('test string'));
	viewPageElement.appendChild(category);

	var save = document.createElement('button');
	save.className = 'flat-button save';
	save.id = 'save-' + target;
	save.appendChild(document.createTextNode('SAVE'));
	viewPageElement.appendChild(save);

	//update the ID's on the previous and next buttons
	var prevButton = document.getElementsByClassName('prev')[0];
	prevButton.id = 'prev-' + target;
	var nextButton = document.getElementsByClassName('next')[0];
	nextButton.id = 'next-' + target;

}

function renderData (dataObj) {
	data = dataObj.files;
	numberOfElements = data.length;

	// images
	for (i = 0; i < data.length; i++) {
			var card = document.createElement('div');
			card.className = 'card ';
			card.style.backgroundImage = 'url("/images/' + data[i] + '")';

				var menu = document.createElement('button');
				menu.id = 'menu-' + i;
				menu.className = 'menu';

					for (n = 0; n < 3; n++) {
						var dot = document.createElement('div');
						dot.className = 'menu-dot';
						menu.appendChild(dot);
					}

				card.appendChild(menu);
				
			var target = document.getElementsByClassName('container')[0];
			target.appendChild(card);
	}
	var header = document.getElementsByTagName('header')[0];
	header.style.display ='block';
}

loadData();

document.body.addEventListener('click', function(event){
	updateListener(event.target.id || event.srcElement.id)
});

