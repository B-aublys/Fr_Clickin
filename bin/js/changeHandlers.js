import {getClickItemID} from "./getClickItemID"
import { get } from "http"



// To all the loaded items add listeners to all their buttons
class changeHandler{ 
    constructor(website, itemList){
        this.website = website 
        this.itemList = itemList.getElementsByClassName("clickItem")
        for (let element of this.itemList){
            element.getElementsByClassName("interval")[0].
                addEventListener("blur", changedEvent => this.changeInterval(changedEvent))
    
            element.getElementsByClassName("intervalDropDown")[0].
                addEventListener("change", changedEvent => this.changeIntervalStep(changedEvent))
    
            element.getElementsByClassName("itemClassifier")[0].
                addEventListener("blur" ,changedEvent => this.changeItemClassifier(changedEvent))
    
            element.getElementsByClassName("startStop")[0].
                addEventListener("click", clickEvent => this.switchClicker(clickEvent))
            
            // Option dropdown handler
            element.getElementsByClassName("dropDownButton")[0].
                addEventListener("click", clickEvent => this.optionDropdown(clickEvent))

            // Dropdown option handler
            element.getElementsByClassName("dropDown")[0].
                addEventListener("click", clickEvent => this.dropdownEventHandler(clickEvent))
            
            element.getElementsByClassName("boost")[0].
            addEventListener("blur", changeEvent => this.boostChange(changeEvent))
        }

        document.getElementById("parentStarter").
            addEventListener("click", () => this.startAllClickers())

        document.getElementById("parentStopper").
            addEventListener("click", () => this.stopAllClickers())

    }


    removeLetters(str){
        let newValue = ""
        for (let [charnr, char] of Object.entries(str)){
            if("0123456789".indexOf(char) !== -1){
                newValue += char
            } 
        }
        return  newValue
    }


    // delete all characters that are not numbers and change the interval
    changeInterval(changedEvent){
        let elemID = getClickItemID(changedEvent.target)
        let intervalValue = changedEvent.target.innerHTML.trim()

        let newValue = this.removeLetters(intervalValue)
        changedEvent.target.innerHTML = newValue
    
        this.writeChanges([{[elemID]: ["interval", parseInt(newValue)]}])
    }

    // use ms or s for the time interval*;
    changeIntervalStep(changeEvent){
        let elemID = getClickItemID(changeEvent.target)
        this.writeChanges([{[elemID]: ["intervalStep", changeEvent.target.value]}])
    }

    // Change the name of the clicker
    changeItemClassifier(changedEvent){
        let elemID = getClickItemID(changedEvent.target)
        this.writeChanges([{[elemID]: ["name", changedEvent.target.innerHTML]}])
    }

    // change = {key, value} of clicker in the local memory
    // and restart the changed clicker
    // changeList:  {elemID: [changeKey: changeValue]}
    writeChanges(changeList){
        let clickersToRestart = []
        browser.storage.local.get(this.website, websiteData =>{
            let oldMemory = JSON.parse(websiteData[this.website])
        for (let change of changeList){

            // for the item based on ID change an attribute
            let elemID = Object.keys(change)[0]
            let actualChange = change[elemID] 
            oldMemory[elemID][actualChange[0]] = actualChange[1]
            clickersToRestart.push({[elemID]: oldMemory[elemID]})
        }
        browser.storage.local.set({[this.website]: JSON.stringify(oldMemory)}, () => {
            // Restart all the clicker that have been changed
            for(let clicker of clickersToRestart){
                this.restartClicker(clicker)
            }            
        })})

    }


    // Change the state of the clicker ON/OFF
    switchClicker(clickEvent){
        let {parentElement, elemID} = getClickItemID(clickEvent.target, parent=true)
        if(parentElement.className.indexOf("Active") == -1){
            this.writeChanges([{[elemID]: ["active", true]}])
            parentElement.className = this.insertActive(parentElement.className)
        // If clicker is on
        } else {
            this.writeChanges([{[elemID]: ["active", false]}])
            parentElement.className = parentElement.className.replace("Active", "")
        }
    }

    // Sends a restart clicker message to the content script
    restartClicker(clicker){
        browser.tabs.query({currentWindow: true, active: true }, tabsList => {
        browser.tabs.sendMessage(tabsList[0].id, {"ID": "restartClicker", "clicker": clicker})
        })
    }

    // starts all the clickers
    startAllClickers(){
        let changeList = []
        for (let element of this.itemList){
            let elemID = getClickItemID(element)
            if (element.className.indexOf("Active") == -1){
                changeList.push({[elemID]: ["active", true]})
                element.className = this.insertActive(element.className)
            }
        }
        this.writeChanges(changeList)
    }

    // stops all the clickers
    stopAllClickers(){
        let changeList = []
        for (let element of this.itemList){
            let elemID = getClickItemIDbu(element)
            if (element.className.indexOf("Active") != -1) {
                changeList.push({[elemID]: ["active", false]})
                //TODO: make this handled with callbacks
                element.className = element.className.replace("Active", "")
            }
        }
        this.writeChanges(changeList)
    }

    // inserts  "Active" before the last work of the string
    insertActive(classNames) {
        classNames = classNames.split(" ")
        classNames.splice(-1, 0, "Active")
        return classNames.join(" ")
    }


    optionDropdown(clickEvent){
        let arrowObject = clickEvent.target
        let {parentElement, elemID} = getClickItemID(arrowObject, parent=true)
        let dropdownOptions = parentElement.getElementsByClassName("dropDown")[0] 
        // if the options are not open, open them
        if (arrowObject.className.indexOf("Opened") == -1){
            arrowObject.className +=" Opened"

            // This gets the dropdown obejct and opens it
            dropdownOptions.className += " Opened"
        } else {    
            // If they close them
            arrowObject.className = arrowObject.className.replace(" Opened", " Closed")
            dropdownOptions.className = dropdownOptions.className.replace(" Opened"," Closed")
        }
    }

    dropdownEventHandler(clickEvent){
        let clickedButton = clickEvent.target
        let clickedOption = clickedButton.getAttribute("name")
        let elemID = getClickItemID(clickedButton)

        if (clickedOption){
            if(clickedButton.className.indexOf("selected") == -1){
                this.writeChanges([{[elemID]: [clickedOption, true]}])
                clickedButton.className += " selected"
            } else {
                this.writeChanges([{[elemID]: [clickedOption, false]}])
                clickedButton.className = clickedButton.className.replace(" selected", "")
            }
        }
    }

    boostChange(changeEvent){
        let elemID = getClickItemID(changeEvent.target)
        // TODO: add more filtering
        let boost = this.removeLetters(changeEvent.target.innerHTML)
        this.writeChanges([{[elemID]: ["boost", parseInt(boost)]}])
    }
}


export {changeHandler}