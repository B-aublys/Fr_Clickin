
// Get button elements
const nukeButton = document.getElementById("nukeButton")
const clearButton = document.getElementById("clearButton")


// Removes all the local stored data of clicker from the currently active tab website
function deleteThisSitesData(){
    // Get the currently active tab
    browser.tabs.query({currentWindow: true, active: true}, (tabs) => {
        // Ask the contentScript for the website url
        browser.tabs.sendMessage(tabs[0].id, {"ID": "website"}, webResp => {
            if(webResp){
                browser.storage.local.remove(webResp["website"], () => console.log("Deleted: " + webResp["website"]))
                // asks to restart clickers for the current tab
                // Since all the clickers will be deleted it will just stop
                // the running ones
                SendRestartClickersMessage([tabs[0]]) 
            }
        })
    })
}

// clears the local storage off clickers and restarts them in each tab
// stoping them all
function nukeData() {
    browser.storage.local.clear(() => browser.tabs.query({currentWindow: true}, (tabs) => {
        SendRestartClickersMessage(tabs)}))
}

function SendRestartClickersMessage(tabs){
    
    for (tab of tabs){
        browser.tabs.sendMessage(tab.id, {"ID": "removeClickers"})
    }
}

clearButton.addEventListener("click", () => deleteThisSitesData())
nukeButton.addEventListener("click", () => nukeData())