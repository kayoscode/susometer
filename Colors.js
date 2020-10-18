var maxColors = 10;
var minColors = 1;
var allColors = ["red", "blue", "green", "lime", "pink", "orange", "yellow", "black", "white", "purple", "brown", "cyan"];
var defaultColors = ["red", "blue", "green", "lime", "pink", "orange", "yellow", "black", "white", "purple"];
var topColorButtonElements = {};
var topColorButtonSelections = [];

var gameStarted = false;
var me = "";

function chooseDefaultColors() {
	for(var i = 0; i < defaultColors.length; i++) {
		selectTopColor(defaultColors[i]);
	}
	
	setMyColor("red");
}

function initTopColorButtonElements() {
	var div = document.getElementsByClassName("topColors")[0];
	
	for(var i = 0; i < allColors.length; i++) {
		topColorButtonElements[allColors[i]] = div.getElementsByClassName("colorButton " + allColors[i])[0];
	}
}

$(function() {
	initTopColorButtonElements();
	chooseDefaultColors();
});

function selectTopColor(color) {
	var index = topColorButtonSelections.indexOf(color);
	
	if(index !== -1) {
		if(removeTopButtonSelection(color)) {
			topColorButtonSelections.splice(index, 1);
		}
	}
	else {
		if(addTopButtonSelection(color)) {
			topColorButtonSelections.push(color)
		}
	}
	
	//show and hide subbuttons accordingly
	for(var i = 0; i < topColorButtonSelections.length; i++) {
		var el = topColorButtonElements[topColorButtonSelections[i]].parentElement;
		
		for(var j = 0; j < topColorButtonSelections.length; j++) {
			var el2 = el.getElementsByClassName(topColorButtonSelections[j])[0];
			
			$(el2).removeClass("hidden");
			$(el2).addClass("shown");
		}
		
		//hide all elements not selected
		var difference = allColors.filter(x => !topColorButtonSelections.includes(x));
		
		for(var j = 0; j < difference.length; j++) {
			var el2 = el.getElementsByClassName(difference[j])[0];
			$(el2).addClass("hidden");
			$(el2).removeClass("shown");
		}	
	}
	
	updateSelectionOdds();
}

function updateSelectionOdds() {
	for(var i = 0; i < topColorButtonSelections.length; i++) {
		var odds = calculateOdds(topColorButtonSelections[i]) * 100;
		$(topColorButtonElements[topColorButtonSelections[i]]).text(odds.toFixed(2));
	}
}

function addTopButtonSelection(color) {
	if(topColorButtonSelections.length >= maxColors) {
		return false;
	}
	
	
	$(topColorButtonElements[color]).addClass("colorButtonSelected");
	$(topColorButtonElements[color].parentElement).find(".subColorButtons").addClass("subColorButtonsSelected");
	
	return true;
}

function removeTopButtonSelection(color) {
	if(topColorButtonSelections.length <= minColors) {
		return false;
	}
	
	$(topColorButtonElements[color]).removeClass("colorButtonSelected");
	$(topColorButtonElements[color]).text("");
	
	$(topColorButtonElements[color].parentElement).find(".subColorButtons").removeClass("subColorButtonsSelected");
	
	//make sure that removing the element doesn't invalidate the 'me' variable
	if(color === me) {
		for(var i = 0; i < topColorButtonSelections.length; i++) {
			if(topColorButtonSelections[i] !== me) {
				setMyColor(topColorButtonSelections[i]);
				break;
			}
		}
	}
	
	return true;
}

function startGame(el) {
	var unselected = allColors.filter(x => !topColorButtonSelections.includes(x));
	
	for(var i = 0; i < unselected.length; i++) {
		$(topColorButtonElements[unselected[i]].parentElement).addClass("hidden");
	}
	
	$(el.target).text("End Game");
	el.target.onclick = endGame;
	
	//enable the sliders
	var sliders = document.getElementsByClassName("slider");
	for(var i = 0; i < sliders.length; i++) {
		$(sliders[i]).removeAttr("disabled");
	}
	
	gameStarted = true;
}

function endGame(el) {
	for(var i = 0; i < allColors.length; i++) {
		$(topColorButtonElements[allColors[i]].parentElement).removeClass("hidden");
	}
	
	$(el.target).text("Start Game");
	el.target.onclick = startGame;
	
	//disable the sliders
	var sliders = document.getElementsByClassName("slider");
	for(var i = 0; i < sliders.length; i++) {
		sliders[i].value = 50;
		sliders[i].disabled = "true";
	}
	
	gameStarted = false;
}

function getColorFromConfirmationButton(el) {
	el = el.parentElement.parentElement;
	
	for(var i = 0; i < allColors.length; i++) {
		var color = el.getElementsByClassName(allColors[i]);
		
		if(color.length > 1) {
			return allColors[i];
		}
	}
	
	return "red";
}

function clear(evt) {
	if(gameStarted) {
		var color = getColorFromConfirmationButton(evt.target);
	}
}

function imposter(evt) {
	if(gameStarted) {
		var color = getColorFromConfirmationButton(evt.target);
	}
}

function dead(evt) {
	if(gameStarted) {
		var color = getColorFromConfirmationButton(evt.target);
	}
}

function setMe(evt) {
	var color = getColorFromConfirmationButton(evt.target);
	setMyColor(color);
}

function setMyColor(color) {
	//enable previous color buttons
	if(me !== "") {
		var el = topColorButtonElements[me].parentElement.getElementsByClassName("subColorButtons")[0];
		
		var colorButtons = el.getElementsByClassName("subColorButton");
		for(var i = 0; i < colorButtons.length; i++) {
			$(colorButtons[i]).removeAttr("disabled");
			$(colorButtons[i]).removeClass("subColorButtonMe");
		}
	}
	
	//disable color buttons
	var el = topColorButtonElements[color].parentElement.getElementsByClassName("subColorButtons")[0];
	
	var colorButtons = el.getElementsByClassName("subColorButton");
	for(var i = 0; i < colorButtons.length; i++) {
		colorButtons[i].disabled = "true";
		$(colorButtons[i]).addClass("subColorButtonMe");
	}
	
	me = color;
}

function calculateOdds(color) {
	return 1 / (topColorButtonSelections.length);
}