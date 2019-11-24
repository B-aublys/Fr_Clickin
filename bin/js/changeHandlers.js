import {getClickItemID} from "./getClickItemID"



// To all the loaded items add listeners to all their buttons
class changeHandler{ 
    constructor(website, itemList){
        this.website = website 
        this.itemList = itemList
        for (let element of itemList.getElementsByClassName("clickItem")){
            element.getElementsByClassName("interval")[0].
                addEventListener("blur", changedEvent => this.changeInterval(changedEvent))
    
            element.getElementsByClassName("intervalDropDown")[0].
                addEventListener("change", changedEvent => this.changeIntervalStep(changedEvent))
    
            element.getElementsByClassName("itemClassifier")[0].
                addEventListener("blur" ,changedEvent => this.changeItemClassifier(changedEvent))
    
            element.getElementsByClassName("startStop")[0].
                addEventListener("click", clickEvent => this.switchClicker(clickEvent))
        }
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

        this.writeChange({interval: parseInt(newValue)}, elemID, this.website)
    }

    // use ms or s for the time interva;
    changeIntervalStep(changeEvent){
        let elemID = getClickItemID(changeEvent.target)
        this.writeChange({intervalStep: changeEvent.target.value}, elemID, this.website)
    }

    // Change the name of the clicker
    changeItemClassifier(changedEvent){
        let elemID = getClickItemID(changedEvent.target)
        this.writeChange({name: changedEvent.target.innerHTML}, elemID, this.website)
    }

    // change = {key, value} of clicker in the local memory
    // and restart the changed clicker
    writeChange(change, elemID){

        browser.storage.local.get(this.website, websiteData =>{
            let dataObject = JSON.parse(websiteData[this.website])
            dataObject[elemID][Object.keys(change)[0]] = change[Object.keys(change)[0]]
            let clicker = {[elemID]: dataObject[elemID]}
            browser.storage.local.set({[this.website]: JSON.stringify(dataObject)}, () => this.restartClicker(clicker))
        })
    }


    // Change the state of the clicker ON/OFF
    switchClicker(clickEvent){
        let elemID = getClickItemID(clickEvent.target)
        
        // If clicker is  off
        if(clickEvent.target.className.indexOf("Active") == -1){
            this.writeChange({active: true}, elemID, this.website)
            clickEvent.target.className += " Active"
        // If clicker is on
        } else {
            this.writeChange({active: false}, elemID, this.website)
            clickEvent.target.className = clickEvent.target.className.replace("Active", "")
        }
    }

    // Sends a restart clicker message to the content script
    restartClicker(clicker){
        browser.tabs.query({currentWindow: true, active: true }, tabsList => {
        browser.tabs.sendMessage(tabsList[0].id, {"ID": "restartClicker", "clicker": clicker})
        })
    }
}


export {changeHandler}