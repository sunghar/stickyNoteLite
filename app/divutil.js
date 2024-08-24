//-------------------------------------------------------
//                  for div
//-------------------------------------------------------
function createDiv(divId, className, innerHTML) {
    var div = document.createElement('div');
    div.id = divId;
    div.className = className;
    if (innerHTML) {
        div.innerHTML = innerHTML;
    }
    return div
}

function createButtomButtonInner(divId) {
    return `
            <button class="hidden-button" onclick="deleteItem()" id="`+ divId + `" >❎</button>
            <button class="hidden-button" onclick="doneItem()"  id="`+ divId + `" >✅</button>
            <button class="hidden-button" onclick="setTop()"  id="`+ divId + `" >⬆️</button>
        `
}
