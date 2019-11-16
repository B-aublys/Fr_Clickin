const nukeButton = document.getElementById("nukeButton")
const clearButton = document.getElementById("clearButton")


function deleteThisSitesData(){
    chrome.tabs.query({currentWindow: true, active: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {"ID": "website"}, webResp => {
            console.log(webResp)
            if(webResp){
                chrome.storage.local.remove(webResp["website"], ()=> console.log("Deleted" + webResp["website"]))
                SendRestartClickersMessage(tabs[0])
            }
        })
    })
}

function nukeData() {
    chrome.storage.local.clear(() => console.log("deleted all Data"))
    chrome.tabs.query({currentWindow: true}, (tabs) => {
        SendRestartClickersMessage(tabs)
    })
}

function SendRestartClickersMessage(tabs){
    for (tab of tabs){
        chrome.tabs.sendMessage(tab.id, {"ID": "restartClickers"})
    }
}

clearButton.addEventListener("click", () => deleteThisSitesData())
nukeButton.addEventListener("click", () => nukeData())