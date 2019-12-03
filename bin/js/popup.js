import {changeHandler} from "./changeHandlers"
import {deleteHandler} from "./deleteHandlers"
import {writeAccordingMessage} from "./helpMessenger"


const itemList = document.getElementById("listOfItems")
const position = "beforeend"
let website 
// let helpMessage = "<p class='helpMessage'>Right click on an element and select <br/>'Send Element to Clicker'</p>"
// let unavailableMessage = "<p class='helpMessage'>Sorry we only work with http sites, if that bothers you please leave feadback ;), so we can improve the extension <br/> <b>Try reloading the page</b></p>"

function loadItems(){
    browser.tabs.query({currentWindow: true, active: true}, (tabs) => {
        browser.tabs.sendMessage(tabs[0].id, {"ID": "website"}, webResp => {
            if(webResp){
                website = webResp.website
            browser.storage.local.get(website, itemData => {
                if(itemData[website]){
                let content = JSON.parse(itemData[website])
                for (let [itemNr, item] of Object.entries(content)){
                    let clickerItem = `<div class="clickItem ${item.active? "Active" : ""} ${itemNr}">
                    <div class='clickItemContainer'>
                    <div class="startStop elevatingInput "></div>
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
                    <div class="dropDownButton elevatingInput Closed"></div>
                    <div class="deleteButton elevatingInput"></div>
                    </div>
                    <div class="dropDown">
                        <div class="radioOption ${item.mouseDown? "selected": ""}" name="mouseDown">MouseDown</div>
                        <div class="radioOption ${item.click? "selected": ""}" name="click">Click</div>
                        <div class="radioOption ${item.mouseUp? "selected": ""}" name="mouseUp">MouseUp</div>

                        <div class="boostHolder">
                            <span>Boost:</span>
                            <div contentEditable class="boost elevatingInput">
                            ${item.boost}
                            </div>
                        </div>
                    </div>
                    </div>`
                    
                    // let eToInsert = document.createElement("div")
                    // eToInsert.innerHTML = clickerItem
                    // itemList.appendChild(eToInsert)
                    itemList.insertAdjacentHTML(position, clickerItem)
                    }

                    // Load the event handlers
                    let changeH = new changeHandler(website, itemList)
                    let deleteH = new deleteHandler(website, itemList)
                    
                    writeAccordingMessage()
                    } else {
                        writeAccordingMessage()
                    }
                })
            } else {
                writeAccordingMessage()
            }
            }
        )
    })
}


window.addEventListener("load", loadItems)
