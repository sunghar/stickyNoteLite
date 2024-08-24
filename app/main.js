var inputBox = document.getElementById('inputBox');
var dataPath = "";
var itemLength = 0;
var currentDataStatus = DataUpdateStatus.NO_UPDATED;
var currentColorTargrt = null;
var idEventes = new idEventBinder();
var e = dataStatusCallBack;

idEventes.add(
    // bottom button
    new idEvent("textColor", "click", callbackExecutor.noCallback(chooseTextColor)),
    new idEvent("uppercase", "click", callbackExecutor.withCallback(setTextUppercase, e)),
    new idEvent("lowercase", "click", callbackExecutor.withCallback(setTextLowercase, e)),
    new idEvent("bold", "click", callbackExecutor.withCallback(setTextStyle, e)),
    new idEvent("opacity", "click", callbackExecutor.withCallback(setBackgroundOpacity, e)),
    new idEvent("saveOrRestore", "click", callbackExecutor.withCallback(saveOrRestore, e)),
    new idEvent("backgroundColor", "click", callbackExecutor.withCallback(setBackgroundColor, e)),
    new idEvent("quit", "click", callbackExecutor.noCallback(quitWindows)),
    new idEvent("overlayOpacity", "onchange", callbackExecutor.withCallback(setOpacity, e)),
    // blur
    new idEvent("inputBox", "blur", callbackExecutor.noCallback(inputBoxBlur)),
    new idEvent("inputBox", "keydown", callbackExecutor.withCallback(newItem, e)),
);
idEventes.bind();

//-------------------------------------------------------
//                  bottom button
//-------------------------------------------------------
function chooseTextColor() {
    currentColorTargrt = DivTarget.FONT_GROUND_COLOR;
    showColorPanel();
}

function setTextUppercase() {
    var currentFontSize = parseFloat(window.getComputedStyle(inputBox).fontSize);
    inputBox.style.fontSize = currentFontSize + 1 + 'px';
    return true;
}

function setTextLowercase() {
    var currentFontSize = parseFloat(window.getComputedStyle(inputBox).fontSize);
    inputBox.style.fontSize = currentFontSize - 1 + 'px';
    return true;
}

function setTextStyle() {
    var currentFontWeight = inputBox.style.fontWeight;
    if (currentFontWeight === 'bold') {
        inputBox.style.fontWeight = 'normal';
    } else {
        inputBox.style.fontWeight = 'bold';
    }
    return true;
}

function setBackgroundOpacity() {
    showOpacityPanel();
    return false;
}

function saveOrRestore() {
    window.electronAPI.receive('set-restore-path', (event, path) => {
        console.log("[main.js] data path " + path);
        if (path == null) {
            return;
        } else {
            dataPath = path;
            allData.filePath = path;
        }
        restoreDataFromCache();
    });
    window.electronAPI.send('set-restore-path');
}

function setBackgroundColor() {
    currentColorTargrt = DivTarget.BACK_GROUND_COLOR;
    showColorPanel();
    return false;
}

function quitWindows() {
    window.electronAPI.send('close-window');
}

function setOpacity(newValue) {
    allData.backgroundColor = allData.backgroundColor.replace(/(\d+(\.\d+)?)\)$/, Number(newValue) / 100 + ')');
    document.body.style.backgroundColor = allData.backgroundColor;
    closeOpacityPanel();

}


//-------------------------------------------------------
//                  items proccess
//-------------------------------------------------------
function deleteItem() {
    var divs = inputBox.querySelectorAll('div');
    divs.forEach(function (div) {
        if (div.id === event.target.id) {
            inputBox.removeChild(div);
            currentDataStatus = DataUpdateStatus.UPDATED;
            return;
        }
    });
}

function doneItem() {
    var parentDiv = document.getElementById(event.target.id);
    var textDiv = parentDiv.querySelector('div');
    textDiv.style.textDecoration = 'line-through';
    textDiv.style.textDecorationColor = 'red';
    textDiv.setAttribute("done", "true");
    currentDataStatus = DataUpdateStatus.UPDATED;
}

function setTop() {
    var divToMove = document.getElementById(event.target.id);
    if (divToMove.parentNode === inputBox && divToMove !== inputBox.firstChild) {
        inputBox.removeChild(divToMove);
        inputBox.insertBefore(divToMove, inputBox.firstChild);
    }
    currentDataStatus = DataUpdateStatus.UPDATED;
}


function inputBoxBlur() {
    var inputContent = inputBox.innerHTML;
    inputContent = inputContent.replace(/<div>/g, '</div><div>');
    inputBox.innerHTML = inputContent;
    var divs = inputBox.querySelectorAll('.items');
    divs.forEach(function (div, index) {
        if (divs.length != index + 1 && div.className == "items") {
            var d = div.querySelector('.item_content');
            if (d.innerText == '') {
                div.remove();
                currentDataStatus = DataUpdateStatus.UPDATED;
                return;
            }
        }

        if (divs.length != index + 1 && div.textContent.trim() === ''
            && div.className != 'item_content'
        ) {
            div.remove();
            currentDataStatus = DataUpdateStatus.UPDATED;
            return;
        }
    });
}


function newItem(event) {
    // 检查是否按下了 Enter 键  
    if (event.key === 'Enter') {
        // 阻止换行符的输入  
        event.preventDefault();
        itemLength++;
        var divId = "itemId_" + itemLength;
        var inner = createButtomButtonInner(divId);
        var itemDiv = createDiv(divId, "items", "");
        var contentDiv = createDiv(divId, "item_content", "");
        var buttonsDiv = createDiv(divId, "buttonList", inner);
        itemDiv.appendChild(contentDiv);
        itemDiv.appendChild(buttonsDiv);

        event.target.appendChild(itemDiv)
        contentDiv.focus();
        var range = document.createRange();
        if (contentDiv.childNodes.length === 0) {
            var textNode = document.createTextNode('');
            contentDiv.appendChild(textNode);
        }
        range.setStart(contentDiv.childNodes[0], 0);
        range.collapse(true);
        var selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    }
    return true;
}


//-------------------------------------------------------
//                  for bottom proccess
//-------------------------------------------------------
function showColorPanel() {
    document.getElementById('overlayDiv').classList.remove('hidden');
}

function closeColorPanel() {
    document.getElementById('overlayDiv').classList.add('hidden');
    return true
}

function showOpacityPanel() {
    document.getElementById('overlayOpacity').classList.remove('hidden');
}

function closeOpacityPanel() {
    document.getElementById('overlayOpacity').classList.add('hidden');
    return true
}

function setColor(hex, seltop, selleft, html5) {
    if (currentColorTargrt == null) {
        return;
    }
    var c;
    if (html5 && html5 == 5) {
        c = document.getElementById("html5colorpicker").value;
    } else {
        if (hex == 0) {
            c = document.getElementById("entercolor").value;
        } else {
            c = hex;
        }
    }
    colorhex = window.tinycolor(c).toHexString();
    r = window.tinycolor(c).toRgb().r;
    g = window.tinycolor(c).toRgb().g;
    b = window.tinycolor(c).toRgb().b;

    var bgColorComputed = window.getComputedStyle(document.body).backgroundColor;
    var rgbaRegex = /^rgba\((\d+),\s*(\d+),\s*(\d+),\s*(\d+(\.\d+)?)\)$/;
    var rgbaMatch = bgColorComputed.match(rgbaRegex);

    if (rgbaMatch) {
        var alpha = parseFloat(rgbaMatch[4]);
        switch (currentColorTargrt) {
            case DivTarget.BACK_GROUND_COLOR:
                document.body.style.backgroundColor = "rgba(" + [r, g, b, alpha].join(",") + ")";
                break;
            case DivTarget.FONT_GROUND_COLOR:
                document.querySelector('.input-box').style.color = "rgb(" + [r, g, b].join(",") + ")";
                break;
            default:
                console.log("[main.js] setcolor wrong current target");
        }
    } else {
        console.log("[main.js] Background color is not in rgba format.");
    }
    dataStatusCallBack(closeColorPanel());
}

//----------------------------------------------------------
//                      other func
//----------------------------------------------------------
function dataStatusCallBack(status) {
    switch (status) {
        case true:
            currentDataStatus = DataUpdateStatus.UPDATED;
            break;
        case false:
            currentDataStatus = DataUpdateStatus.NO_UPDATED;
            break;
        default:
            console.log("[main.js] data status callback wrong current target");
    }
}


window.onload = function () {
    console.log(Tasks.a)
    new TaskExecutor()
        .addInitializingTask(Tasks.updataDataFromCache)
        .addIntervalTask(Tasks.updataDataToCache, 10000);
};