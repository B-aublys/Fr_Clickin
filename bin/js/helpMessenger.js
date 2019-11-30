function writeAccordingMessage(){
    let currentClickers = 0    
    const position = "beforeend"
    const helpMessage = `<div id='helpMessage'></div>`
    const itemList = document.getElementById("listOfItems")
    for (let item of itemList.childNodes){
        if (item.tagName == "DIV"){
            currentClickers++
        }
    }

    console.log(currentClickers)
    if (currentClickers == 0){
        itemList.insertAdjacentHTML(position, helpMessage)
    }

}

export {writeAccordingMessage}