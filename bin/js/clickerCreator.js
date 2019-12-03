// Create a new clicker object in the local.storage
// of there isn't already one with the same ID or xpath 
// Since the storage is stored based on the sites URI (to avoid dynamic links...)
// If there is an Item with the same ID or xpath it will be considered as 1
// Don't know what kind of effect it will have on the usability, but I think very minimal
function createClicker(id, relativeID, xpath){
	let currentClickerIDlist = []
	let newClicker = { 
	  "elemID": id,
	  "name": id? id:relativeID,
	  "relativeID": relativeID,
	  "xpath": xpath,
	  "interval": 1,
	  "intervalStep": "s",
	  "active": false,
	  "mouseDown": false,
	  "click": true,
	  "mouseUp": false,
	  "boost": 1,
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


// Generates a semirandon ID of anyt length
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


function removeClickers(){
	for (let [clickerNr, clicker]  of Object.entries(clickers)){
		removeClicker(clickerNr)
	}
}


function removeClicker(clickerID){
	clearInterval(clickers[clickerID])
}



export {createClicker, removeClicker, removeClickers}