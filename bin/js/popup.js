const itemList = document.getElementById("listOfItems")
const position = "beforeend"
let website 
let helpMessage = "<p class='helpMessage'>Right click on an element and select <br/>'Send Element to Clicker'</p>"
let unavailableMessage = "<p class='helpMessage'>Sorry we only work with http sites, if that bothers you please leave feadback ;), so we can improve the extension <br/> <b>Try reloading the page</b></p>"


function onError(err){
    console.log("Error: " + err)
}

// To all the loaded items add listeners to all their buttons
function AddListeners(){
    for (let element of itemList.getElementsByClassName("clickItem")){
        // Delete button
        element.getElementsByClassName("deleteButton")[0].
            addEventListener("click", click => deleteItem(click.target))
        
        // Interval
        element.getElementsByClassName("interval")[0].
            addEventListener("blur", changedEvent => changeInterval(changedEvent))

        element.getElementsByClassName("intervalDropDown")[0].
            addEventListener("change", changedEvent => changeIntervalStep(changedEvent))

        element.getElementsByClassName("itemClassifier")[0].
            addEventListener("blur" ,changedEvent => changeItemClassifier(changedEvent))

        element.getElementsByClassName("startStop")[0].
            addEventListener("click", activationEvent => switchClicker(activationEvent))
    }
}


function changeInterval(changedEvent){
    let clickerID = getClickItemID(changedEvent.target)
    let intervalValue = changedEvent.target.innerHTML.trim()
    let newValue = "" 

    for (let [charnr, char] of Object.entries(intervalValue)){
        if("0123456789".indexOf(char) !== -1){
            newValue += char
        } 
        changedEvent.target.innerHTML = newValue
    }

    writeChange({interval: parseInt(newValue)}, clickerID)
}

function changeIntervalStep(changeEvent){
    let clickerID = getClickItemID(changeEvent.target)
    writeChange({intervalStep: changeEvent.target.value}, clickerID)
}

function changeItemClassifier(changedEvent){
    let clickerID = getClickItemID(changedEvent.target)
    writeChange({name: changedEvent.target.innerHTML}, clickerID)
}

// change = {key, value} of clicker
function writeChange(change, clickerID){

    browser.storage.local.get(website, websiteData =>{
        let dataObject = JSON.parse(websiteData[website])
        dataObject[clickerID][Object.keys(change)[0]] = change[Object.keys(change)[0]]
        // TODO: delete this if it's not needed
        // let clicker = {[clickerID]: dataObject[clickerID]}
        browser.storage.local.set({[website]: JSON.stringify(dataObject)}, () => restartClicker(clickerID))
      })
}


function switchClicker(activationEvent){
    let clickerID = getClickItemID(activationEvent.target)
    
    // If clicker is turned off
    if(activationEvent.target.className.indexOf("Active") == -1){
        writeChange({active: true}, clickerID)
        activationEvent.target.className += " Active"
    } else {
        writeChange({active: false}, clickerID)
        activationEvent.target.className = activationEvent.target.className.replace("Active", "")
    }
}


function getClickItemID(target){
    let element = target.parentElement
    console.log(element)
    console.log(target)
    while (true){
        if(element.classList[0] == "clickItem"){
            return element.classList[element.classList.length - 1]
            }
        element = element.parentElement    
    }
}


function loadItems(){
    let added = false
    browser.tabs.query({currentWindow: true, active: true}, (tabs) => {
        browser.tabs.sendMessage(tabs[0].id, {"ID": "website"}, webResp => {
            if(webResp){
                website = webResp.website
            browser.storage.local.get(website, itemData => {
                if(itemData[website]){
                let content = JSON.parse(itemData[website])
                for (let [itemNr, item] of Object.entries(content)){
                    let clickerItem = `<div class="clickItem ${itemNr}">
                    <div class='clickItemContainer'>
                    <div class="startStop elevatingInput ${item.active? "Active" : ""}" >
                        <div class="buttonSizer ${item.active? "Active" : ""}"></div>
                    </div>
                    <div contentEditable autocomplete="off" autocorrect="off" autocapitalize="off"
                        spellcheck="false" class="itemClassifier elevatingInput">${item.name? item.name: "Unnamed"}</div>
                    
                    <div class="intervalHolder">
                        <span>Int:</span>
                        <div contentEditable class="interval elevatingInput">
                        ${item.interval}
                        </div>
                        <select class="intervalDropDown">
                            <option ${item.intervalStep == "ms"? "Selected='selected'":""} value="ms">ms</option>
                            <option ${item.intervalStep == "s"? "Selected='selected'":""} value="s">s</option>
                    </select>
                    </div>
                    <div class="deleteButton elevatingInput"/>
                    </div>
                    </div>`
                    
                    // let eToInsert = document.createElement("div")
                    // eToInsert.innerHTML = clickerItem
                    // itemList.appendChild(eToInsert)
                    itemList.insertAdjacentHTML(position, clickerItem)
                    added = true
                    }
                    AddListeners()    
                }
            if (!added){
                itemList.parentElement.insertAdjacentHTML(position, helpMessage)
                added = true
            }
            })
            } else {
                itemList.parentElement.insertAdjacentHTML(position, unavailableMessage)
                } 
            }
        )
    })
}


// [DELETE]
// Deletes an item by it's id from local storage
// stored in websites name
function deleteItem(elementToDelete){
    console.log("removing item")
    let deleteID = getClickItemID(elementToDelete)
    browser.storage.local.get(website, websiteItems =>{
        let items = JSON.parse(websiteItems[website])
        // TODO: check if this is needed
        // let clicker = items[deleteID]
        delete items[deleteID]
        browser.storage.local.set({[website]: JSON.stringify(items)}, () => {
            stopClickerSignalContentScript(deleteID)
            
            for(let [nr, child] of Object.entries(itemList.childNodes)){
                if(child.tagName == "DIV"){
                    if (child.classList[child.classList.length -1] == deleteID)
                        itemList.removeChild(child)
                    }
            }
            
            // if there are no more clickers, rerun the load command to print the help message
            if(itemList.childNodes.length == 1){
                loadItems()
            }
        })
    })
} 

// Sends a restart signal to restart 1 clicker by it's ID
function restartClicker(clickerID){
    browser.tabs.query({currentWindow: true, active: true }, tabsList => {
    browser.tabs.sendMessage(tabsList[0].id, {"ID": "restartClicker", "clicker": clickerID})
    })
}

function stopClickerSignalContentScript(stopID){
    browser.tabs.query({currentWindow: true, active: true }, tabsList => {
        browser.tabs.sendMessage(tabsList[0].id, {"ID": "stopClicker", "clickerID": stopID})
        })
}



window.addEventListener("load", loadItems)
