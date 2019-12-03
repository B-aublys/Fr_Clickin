import {getClickItemID} from "./getClickItemID"



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
        }

        document.getElementById("parentStarter").
            addEventListener("click", () => this.startAllClickers())

            document.getElementById("parentStopper").
            addEventListener("click", () => this.stopAllClickers())
    }



    // delete all characters that are not numbers and change the interval
    changeInterval(changedEvent){
        let elemID = getClickItemID(changedEvent.target)
        let intervalValue = changedEvent.target.innerHTML.trim()
        let newValue = "" 

        for (let [charnr, char] of Object.entries(intervalValue)){
            if("0123456789".indexOf(char) !== -1){
                newValue += char
            } 
            changedEvent.target.innerHTML = newValue
        }

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
            let elemID = getClickItemID(element)
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
}


export {changeHandler}