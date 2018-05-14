var pathData = {
    campus: "clayton",
    callback: "pathResponse"
};


function jsonpRequest(path, pathData) {
    var script = document.createElement('script');
    script.src = buildSrc(path, pathData);
    document.getElementsByTagName('head')[0].appendChild(script);
}


function buildSrc(path, pathData) {
    return path + "?" + Object.keys(pathData).map(function(dataKey) {
        if (pathData.hasOwnProperty(dataKey)) {
            return encodeURIComponent(dataKey) + '=' + encodeURIComponent(pathData[dataKey]);
        }
    }).join('&');
}

function pathResponse(pathArray) {
    var pathStringObject;

    // Paths got from API
    savedPaths = pathArray;
    // Store paths in local storage
    if (typeof(Storage) !== "undefined") {
        pathStringObject = JSON.stringify(savedPaths);
        localStorage.setItem(MONASH_ROUTE, pathStringObject);
        var monashPathList = createPathList(MONASH_ROUTE);
        var userPathList = createPathList(USER_ROUTE);
        if (monashPathList) {
            renderPathList(monashPathList, 'monashRoute');
        }
        if (userPathList) {
            renderPathList(userPathList, 'userRoute');
        }
    } else {

    }
};

function createPathList(source) {
    let pathList = new PathList(source);
    if (typeof(Storage) !== "undefined") {
        var pathFromLocalStroage = JSON.parse(localStorage.getItem(source));
        if (pathFromLocalStroage) {
            for (let i = 0; i < pathFromLocalStroage.length; i++) {
                let item = pathFromLocalStroage[i];
                pathList.add(new Path(item.locations, item.title));
            }
            return pathList;
        }
        return null;
    } else {
        console.log("Error: Trying with another browser.")
    }
}

function renderPathList(pathList, target) {
    let listHtml = '';
    for (let index = 0; index < pathList.list.length; index++) {
        let path = pathList.list[index];
        listHtml += `<a href="navigate.html"><li class="mdl-list__item mdl-list__item--three-line"
                        id="${pathList.name + index}">
                        <span class="mdl-list__item-primary-content">   
                            <span>${path.title}</span>
                            <span class="mdl-list__item-text-body">
                                ${path.summary()}
                            </span>
                        </span>
                        </li></a>`;
    }

    document.getElementById(target).innerHTML = listHtml;

    for (let index = 0; index < pathList.list.length; index++) {
        let path = pathList.list[index];
        document.getElementById(pathList.name + index + '').addEventListener("click", () => {
            setSelectedPath(path)
        });
    }
}


function setSelectedPath(path) {
    localStorage.setItem('selectedPath', JSON.stringify(path))
}

function initMainPage() {
    jsonpRequest("http://eng1003.monash/api/campusnav/", pathData);
}