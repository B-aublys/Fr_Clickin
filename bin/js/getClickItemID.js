
function getClickItemID(target){
    let element = target.parentElement
    console.log(element)
    console.log(target)
    while (true){
        if(element.classList[0] == "clickItem"){
            return element.classList[element.classList.length - 1]
            }
        element = element.parentElement    
    }
}

export {getClickItemID}