
// Clear moemory on new update 
// TODO: make a smart fix....
browser.runtime.onInstalled.addListener(function() {
  browser.storage.local.clear();
  });



// Log if there was an error creating the context item
function onCreate(){
  if (browser.runtime.lastError){
    onError(browser.runtime.lastError)
  } else {
    console.log("Context Item Created Successfully")
  }
}

function onError(err){
  console.log(`Error: ${err}`)
}
 

//Create the context Item that selects elements for the clicker
browser.contextMenus.create({
    id: "SelectElementForClicker",
    title: "~~[ Send Element to Clicker ]~~",
    contexts: ["all"]
  }, onCreate())

browser.contextMenus.onClicked.addListener((info, tab) =>{
  switch (info.menuItemId){
    case "SelectElementForClicker":
      browser.tabs.sendMessage(tab.id, {"ID": "selected"})
      break
  }
})
