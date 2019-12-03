function writeAccordingMessage(){
    let currentClickers = 0    
    const position = "beforeend"
    const helpMessage = `<div id="helpMessage">Instructions:</div><div id='helpImage'></div>`
    const itemList = document.getElementById("listOfItems")
    for (let item of itemList.childNodes){
        if (item.tagName == "DIV"){
            currentClickers++
        }
    }

    if (currentClickers == 0){
        itemList.insertAdjacentHTML(position, helpMessage)
    }

}

export {writeAccordingMessage}