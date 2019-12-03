import * as xpathHandler from "./xpathHandler"
import * as clickerCreator from './clickerCreator'

// store the last clicked element
let lastClickerElement
// array to store all the running clickers by their ID
let clickers = {}

function messageHandler(request, sender, sendResponse){
	switch (request.ID){
		case "selected":
			let {id, relativeID, xpath} = getElement(lastClickerElement)
			clickerCreator.createClicker(id, relativeID, xpath)
			break
		
		case "website":
			sendResponse({website: window.location.hostname})
			break
			// recopile
		

		// restarts 1 clicker
		case "restartClicker":
			restartClicker(request.clicker)
			break
		
		// Stops a clicker
		case "stopClicker":
			stopClicker(request.clickerID)
			break
		
		// Stops all the clickers
		case "stopClickers":
			stopClickers()
			break
	}
}


// Gets the id and xpath of an element
function getElement(element){
	let id = element.id
	let {relativeID, xpath} = xpathHandler.getXPathOfElement(element)
	return {id, relativeID, xpath}
}   


// FIXME: rename this function to something comprehensive
function getClickers(){
	browser.storage.local.get([window.location.hostname], clickerObjectJSON => {
		if(clickerObjectJSON[window.location.hostname]){
			let clickerObject = JSON.parse(clickerObjectJSON[window.location.hostname])
			for (let [clickerNr, clicker]  of Object.entries(clickerObject)){
				if(clicker.active){
					startClicker(clicker)
				}
			}
		}
	})
}



function restartClicker(clicker){
	let clickerID = Object.keys(clicker)[0]
	clearInterval(clickers[clickerID])
	startClicker(clickerID, clicker[clickerID])
}

function stopClickers(){
	for (let [clickerNr, clicker]  of Object.entries(clickers)){
		stopClicker(clickerNr)
	}
}


function stopClicker(clickerID){
	clearInterval(clickers[clickerID])
}



// Find the element that needs to be clicked
// creates a new entry in the clickers list
function startClicker(clickerID, clickerObject){
	let elementToClick

	if (clickerObject.active){
		let interval = clickerObject.interval
		if (clickerObject.intervalStep == "s"){
			interval *= 1000
		}
		if (clickerObject.elemID){
			elementToClick = document.getElementById(clickerObject.elemID)
		} else {
			let xpathObjects = xpathHandler.evaluateXPath(clickerObject.relativeID ? document.getElementById(clickerObject.relativeID) : document, clickerObject.xpath)


			//TODO: more than 1 xpath handling
			if (xpathObjects.length < 2) {
				elementToClick = xpathObjects[0]
				
			} else {
				console.log("xpath found more that 1 object")
				console.log(xpathObjects)
			}
		}
		if (elementToClick){
			clickers[clickerID] = (setInterval(() => elementToClick.click(), parseInt(interval)))
		}
	}
}



document.addEventListener("mousedown", event => lastClickerElement = event.target);
browser.runtime.onMessage.addListener(messageHandler)
getClickers()