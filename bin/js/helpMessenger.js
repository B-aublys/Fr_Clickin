function writeAccordingMessage(){
    let currentClickers = 0    
    const position = "beforeend"
    const helpMessage = `<div id='helpMessage'>To add a clicker, right click on an element you want to click and send to the clicker </br>
        P.S. We only work on HTTP and HTTPS sites.</div>
    `  
    const itemList = document.getElementById("listOfItems")
    console.log(typeof(itemList.childNodes))
    console.log(itemList)
    console.log(itemList.childNodes)
    for (let item of itemList.childNodes){
        console.log(item.tagName)
        if (item.tagName == "DIV"){
            console.log("adding")
            currentClickers++
        }
    }

    console.log(currentClickers)
    if (currentClickers == 0){
        itemList.insertAdjacentHTML(position, helpMessage)
    }

}

export {writeAccordingMessage}