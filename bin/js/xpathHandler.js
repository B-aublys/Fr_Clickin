

function getXPathOfElement(el){
    let xpath = ""
    // relate from holds the id from which the xpath is relative from
    let relativeID, tempEl, pos

    while(el){
        pos = 0 
        tempEl = el

        if (el.id){
            relativeID = el.id
            xpath = "." + xpath
            break
        }
        
        while(tempEl){
            if(tempEl.nodeType ===1 && tempEl.nodeName === el.nodeName){
                pos+=1
            }
            tempEl = tempEl.previousSibling
        }
        

        xpath = "/" + el.tagName.toLowerCase() + "[" + pos + "]" + xpath
        el = el.parentElement
    }
    return {relativeID, xpath}
}

// MDN snippet for evaluating an xpath expresion and returning it's founds
function evaluateXPath(aNode, aExpr) {
    var xpe = new XPathEvaluator();
    var nsResolver = xpe.createNSResolver(aNode.ownerDocument == null ?
        aNode.documentElement : aNode.ownerDocument.documentElement);
    var result = xpe.evaluate(aExpr, aNode, nsResolver, 0, null);
    var found = [];
    var res;
    while (res = result.iterateNext())
        found.push(res);
    return found;

    }


export {evaluateXPath, getXPathOfElement}