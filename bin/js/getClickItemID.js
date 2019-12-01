
function getClickItemID(element, parent=false){
    while (true){
        if(element.classList[0] == "clickItem"){
            if (parent){
                return {"parentElement": element, "elemID": element.classList[element.classList.length - 1]}
            } else {
                return element.classList[element.classList.length - 1]
            }
        }
        element = element.parentElement    
    }
}

export {getClickItemID}