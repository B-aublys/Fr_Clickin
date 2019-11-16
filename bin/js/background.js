
// Clear moemory on new update 
// TODO: make a smart fix....
chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.local.clear();
  });



// Log if there was an error creating the context item
function onCreate(){
  if (chrome.runtime.lastError){
    onError(browser.runtime.lastError)
  } else {
    console.log("Context Item Created Successfully")
  }
}

function onError(err){
  console.log(`Error: ${err}`)
}
 

//Create the context Item that selects elements for the clicker
chrome.contextMenus.create({
    id: "SelectElementForClicker",
    title: "~~[ Send Element to Clicker ]~~",
    contexts: ["all"]
  }, onCreate())

chrome.contextMenus.onClicked.addListener((info, tab) =>{
  switch (info.menuItemId){
    case "SelectElementForClicker":
      chrome.tabs.sendMessage(tab.id, {"ID": "selected"})
      break
  }
})
