import {getClickItemID} from "./getClickItemID"


class deleteHandler{
    constructor(website, itemList){
        this.website = website
        this.itemList = itemList
        for (let element of this.itemList.getElementsByClassName("clickItem")){
            // Delete button
            element.getElementsByClassName("deleteButton")[0].
                addEventListener("click", click => this.deleteItem(click.target))
        }
    }

    // stops a clicker, removes it's entry from the local memory 
    // takes in the whole element that sent the delete message to use for deleting
    // the html element itsedeleteItem
    deleteItem(elementToDelete){
        console.log("clicked")
        console.log("removindeleteItemitem")
        let deleteID = getClickItemID(elementToDelete)
        browser.storage.local.get(this.website, websiteItems =>{
            let items = JSON.parse(websiteItems[this.website])
            // TODO: find out if this is needed
            // let clicker = items[deleteID]
            delete items[deleteID]
            browser.storage.local.set({[this.website]: JSON.stringify(items)}, () => {
                this.removeSignalContentScript(deleteID)
                
                for(let [nr, child] of Object.entries(this.itemList.childNodes)){
                    if(child.tagName == "DIV"){
                        if (child.classList[child.classList.length -1] == deleteID)
                            this.itemList.removeChild(child)
                        }
                }
                
                //TODO: message handlera
                // // if there are no more clickers, rerun the load command to print the help message
                // if(itemList.childNodes.length == 1){
                //     loadItems()
                // }
            })
        })
    } 
    
    // Sends a message to the content script to stop a clicker
    removeSignalContentScript(deleteID){
        browser.tabs.query({currentWindow: true, active: true }, tabsList => {
            browser.tabs.sendMessage(tabsList[0].id, {"ID": "stopClicker", "clickerID": deleteID})
            })
    }
}

export {deleteHandler}