const nukeButton = document.getElementById("nukeButton")
const clearButton = document.getElementById("clearButton")


function deleteThisSitesData(){
    browser.tabs.query({currentWindow: true, active: true}, (tabs) => {
        browser.tabs.sendMessage(tabs[0].id, {"ID": "website"}, webResp => {
            if(webResp){
                browser.storage.local.remove(webResp["website"], ()=> SendRestartClickersMessage([tabs[0]]))
            }
        })
    })
}

function nukeData() {
    browser.storage.local.clear(() => browser.tabs.query({currentWindow: true}, (tabs) => {
        SendRestartClickersMessage(tabs)}))
}

function SendRestartClickersMessage(tabs){
    for (tab of tabs){
        browser.tabs.sendMessage(tab.id, {"ID": "stopClickers"})
    }
}

clearButton.addEventListener("click", () => deleteThisSitesData())
nukeButton.addEventListener("click", () => nukeData())