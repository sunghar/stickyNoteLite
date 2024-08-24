//-------------------------------------------------------
//                  underlay data proccess &&
//-------------------------------------------------------


var allData = {
    updateTime: null,
    datas: {
        doing: [],
        done:[],
    },
    filePath: "",
    backgroundColor: "",
    fontColor: "",
    fontSize: "16px",
    fontStyle: "normal",
}


function storeDataToCache() {
    getDataFromWindow();
    if (dataPath != "") {
        allData.filePath = dataPath;
    }
    window.electronAPI.send('save-data', allData);
}
function restoreDataFromCache() {
    window.electronAPI.receive('restore-data', (event, data) => {
        console.log(data);
        if (data == null) {
            window.electronAPI.send('save-data', allData);
        } else {
            allData = data;
        }

        setDataToWindow();
    });
    window.electronAPI.send('restore-data', allData.filePath);
}


function getDataFromWindow() {
    allData.datas.doing = [];
    allData.datas.done = [];
    var divs = inputBox.querySelectorAll('div');
    divs.forEach(function (div) {
        if (div.className == 'items') {
            var contentDiv = div.querySelector('div');
            var status = contentDiv.getAttribute("done");
            if (status == "true") {
                allData.datas.done.push(contentDiv.innerText);
            } else {
                allData.datas.doing.push(contentDiv.innerText);
            }
        }
    });

    allData.fontStyle = inputBox.style.fontWeight;
    allData.fontSize = parseFloat(window.getComputedStyle(inputBox).fontSize);
    allData.fontColor = window.getComputedStyle(inputBox).getPropertyValue('color');
    allData.backgroundColor = window.getComputedStyle(document.body).backgroundColor;;
}

function setDataToWindow() {
    inputBox.innerHTML = "";
    var doneIndex = allData.datas.doing.length;
    var datas = [...allData.datas.doing, ...allData.datas.done];
    if (datas.length == 0) {
        doneIndex = 1;
        datas.push("");
    }
    datas.forEach(function (element, index) {
        if (element == '' && datas.length > 1) {
            return;
        }
        itemLength++;
        var divId = "itemId_" + itemLength;
        var inner = createButtomButtonInner(divId);
        var itemDiv = createDiv(divId, "items", "");
        var contentDiv = createDiv(divId, "item_content", element);
        var buttonsDiv = createDiv(divId, "buttonList", inner);
        if (index >= doneIndex) {
            contentDiv.setAttribute("done", "true");
            contentDiv.style.textDecoration = 'line-through';
            contentDiv.style.textDecorationColor = 'red';
        }
        itemDiv.appendChild(contentDiv);
        itemDiv.appendChild(buttonsDiv);
        inputBox.appendChild(itemDiv)
    });

    inputBox.style.fontWeight = allData.fontStyle;
    inputBox.style.fontSize = allData.fontSize + 'px';
    inputBox.style.color = allData.fontColor;
    document.body.style.backgroundColor = allData.backgroundColor;
}