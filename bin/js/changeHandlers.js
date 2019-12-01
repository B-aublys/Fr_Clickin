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

        this.writeChange({interval: parseInt(newValue)}, elemID)
    }

    // use ms or s for the time interval*;
    changeIntervalStep(changeEvent){
        let elemID = getClickItemID(changeEvent.target)
        console.log(elemID)
        console.log(changeEvent.target.value)
        this.writeChange({intervalStep: changeEvent.target.value}, elemID)
    }

    // Change the name of the clicker
    changeItemClassifier(changedEvent){
        let elemID = getClickItemID(changedEvent.target)
        this.writeChange({name: changedEvent.target.innerHTML}, elemID)
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
        let {parentElement, elemID} = getClickItemID(clickEvent.target, parent=true)
        console.log("this is the parent")
        console.log(parentElement)
        // If clicker is  off
        if(parentElement.className.indexOf("Active") == -1){
            this.writeChange({active: true}, elemID)
            parentElement.className = this.insertActive(parentElement.className)
        // If clicker is on
        } else {
            this.writeChange({active: false}, elemID)
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
        for (let element of this.itemList){
            let elemID = getClickItemID(element)
            if (element.className.indexOf("Active") == -1){
                console.log(element)
                console.log(elemID)
                this.writeChange({active: true}, elemID)
                element.className = this.insertActive(element.className)

            }
        }
    }

    // stops all the clickers
    stopAllClickers(){
        console.log("Stopping all")
        for (let element of this.itemList){
            let elemID = getClickItemID(element)
            console.log(element)
            console.log(elemID)
            console.log(element.className.indexOf("Active"))
            if (element.className.indexOf("Active") != -1) {
                console.log("executing")
                this.writeChange({active: false}, elemID)
                element.className = element.className.replace("Active", "")
            }
        }
    }

    // inserts  "Active" before the last work of the string
    insertActive(classNames) {
        classNames = classNames.split(" ")
        classNames.splice(-1, 0, "Active")
        return classNames.join(" ")
    }
}


export {changeHandler}