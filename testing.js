const toclick = document.getElementById("toclick")

toclick.addEventListener("click", e => console.log(e))

let event = new Event("mousedown", {"bubbles":true, "cancelable":false})
toclick.dispatchEvent(event)