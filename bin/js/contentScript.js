// store the last clicked element
let elementObject
// array to store all the running clickers by their ID
let clickers = {}

function messageHandler(request, sender, sendResponse){
	switch (request.ID){
		case "selected":
			WriteNewClicker()
			break
		
		case "website":
			sendResponse({website: window.location.hostname})
			break
		
		case "restartClicker":
			restartClicker(request.clicker)
			break
		
		case "removeClicker":
			removeClicker(request.clickerID)
			break

		case "removeClickers":
			removeClickers()
			break
	}
}


// Gets the id and xpath of an element
function getElement(element){
	let id = element.id
	let {relativeID, xpath} = getXPathOfElement(element)
	return {id, relativeID, xpath}
}   


function getXPathOfElement(el){
	let xpath = ""
	// relate from holds the id from which the xpath is relative from
    let relativeID, tempEl, pos

    while(el){
        pos = 0 
        tempEl = el

        if (el.id){
            relativeID = el.id
            xpath = "." + xpath
            break
        }
        
        while(tempEl){
            if(tempEl.nodeType ===1 && tempEl.nodeName === el.nodeName){
                pos+=1
            }
            tempEl = tempEl.previousSibling
        }
        

        xpath = "/" + el.tagName.toLowerCase() + "[" + pos + "]" + xpath
        el = el.parentElement
	}
    return {relativeID, xpath}
}

// MDN snippet for evaluating an xpath expresion and returning it's founds
function evaluateXPath(aNode, aExpr) {
	var xpe = new XPathEvaluator();
	var nsResolver = xpe.createNSResolver(aNode.ownerDocument == null ?
	  aNode.documentElement : aNode.ownerDocument.documentElement);
	var result = xpe.evaluate(aExpr, aNode, nsResolver, 0, null);
	var found = [];
	var res;
	while (res = result.iterateNext())
	  found.push(res);
	return found;
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


function generateNewClickerID(currentIDs, length){
	while(true) {
		let generated = '';
		let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		let charactersLength = characters.length;
		for ( var i = 0; i < length; i++ ) {
		   generated = generated + characters.charAt(Math.floor(Math.random() * charactersLength));
		}

		if (currentIDs.indexOf(generated) == -1) {
			return generated
		}
	}
}


function restartClicker(clicker){
	let clickerID = Object.keys(clicker)[0]
	clearInterval(clickers[clickerID])
	startClicker(clickerID, clicker[clickerID])
}

function removeClickers(){
	for (let [clickerNr, clicker]  of Object.entries(clickers)){
		removeClicker(clickerNr)
	}
}


function removeClicker(clickerID){
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
			let xpathObjects = evaluateXPath(clickerObject.relativeID ? document.getElementById(clickerObject.relativeID) : document, clickerObject.xpath)


			//TODO: more than 1 xpath handling
			if (xpathObjects.length > 1) {
				elementToClick = xpathObjects[0]
				
			} else {
				console.log("xpath found more that 1 object")
			}
		}
		if (elementToClick){
			clickers[clickerID] = (setInterval(() => elementToClick.click(), parseInt(interval)))
		}
	}
}


// Create a new clicker object in the local.storage
// of there isn't already one with the same ID or xpath 
// Since the storage is stored based on the sites URI (to avoid dynamic links...)
// If there is an Item with the same ID or xpath it will be considered as 1
// Don't know what kind of effect it will have on the usability, but I think very minimal
function WriteNewClicker(message){
	let {id, relativeID, xpath} = getElement(elementObject)
	let currentClickerIDlist = []
	let newClicker = { 
	  "elemID": id,
	  "name": id? id:relativeID,
	  "relativeID": relativeID,
	  "xpath": xpath,
	  "interval": 1,
	  "intervalStep": "s",
	  "active": false
	}

	browser.storage.local.get(window.location.hostname, response => {
	  if (response[window.location.hostname]){
		let responseValue = JSON.parse(response[window.location.hostname])
		
		
		// If there is already an elemen with the same ID or xpath don't generate
		// a new item
		for(let [itemNr, item] of Object.entries(responseValue)){
			currentClickerIDlist.push(itemNr)
		  	if ((item["elemID"] == newClicker["elemID"] && newClicker["elemID"] != "") 
			  || ((item["xpath"] == newClicker["xpath"] && newClicker['xpath'] != "") &&
			  item["relativeID"] == newClicker["relativeID"] && newClicker["relativeID"] != "")){
			return
		  	}
		}

		// Generate a unique ID for the clickerID
		// Used for deleting, restarting the clicker without reseting everyhting
		let clickerID = generateNewClickerID(currentClickerIDlist, 5)
	  // If there are no duplicates add the new item to the list
	  responseValue[clickerID] = newClicker
	  browser.storage.local.set({[window.location.hostname]: JSON.stringify(responseValue)})
	  
	  } else {
		let clickerID = generateNewClickerID(currentClickerIDlist, 5)  
		browser.storage.local.set({[window.location.hostname]: JSON.stringify({[clickerID]: newClicker})})
	  } 
	})
}

document.addEventListener("mousedown", event => elementObject = event.target);
browser.runtime.onMessage.addListener(messageHandler)
getClickers()