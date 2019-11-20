const toclick = document.getElementById("toclick")

toclick.addEventListener("mousedown", e => console.log(e))

let event = new Event("mousedown", {"bubbles":true, "cancelable":false})
toclick.dispatchEvent(event)