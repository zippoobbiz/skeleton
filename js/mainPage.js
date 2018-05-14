var pathData = {
    campus: "clayton",
    callback: "pathResponse"
};

// send jsonp request to get path information
function jsonpRequest(path, pathData) {
    var script = document.createElement('script');
    script.src = buildSrc(path, pathData);
    document.getElementsByTagName('head')[0].appendChild(script);
}

// build jsonp request src based on give path data
function buildSrc(path, pathData) {
    return path + "?" + Object.keys(pathData).map(function(dataKey) {
        if (pathData.hasOwnProperty(dataKey)) {
            return encodeURIComponent(dataKey) + '=' + encodeURIComponent(pathData[dataKey]);
        }
    }).join('&');
}

// callback for success jsonp request
function pathResponse(pathArray) {
    var pathStringObject;

    // Paths got from API
    savedPaths = pathArray;
    // Store paths in local storage
    if (typeof(Storage) !== "undefined") {
        pathStringObject = JSON.stringify(savedPaths);
        localStorage.setItem(MONASH_ROUTE, pathStringObject);
        // create monash route path list
        var monashPathList = createPathList(MONASH_ROUTE);
        // crate user saved path list
        var userPathList = createPathList(USER_ROUTE);
        if (monashPathList) {
            // add path list to html
            renderPathList(monashPathList, 'monashRoute');
        }
        if (userPathList) {
            // add paht list to html
            renderPathList(userPathList, 'userRoute');
        }
    } else {

    }
};

// create pathlist based on given source. Source could be user saved data from local storage or
// path date fetched from server.
function createPathList(source) {
    let pathList = new PathList(source);
    if (typeof(Storage) !== "undefined") {
        var pathFromLocalStroage = JSON.parse(localStorage.getItem(source));
        if (pathFromLocalStroage) { // found path information from give source
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

// render path list to html page
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
    // add click listener for each list item
    for (let index = 0; index < pathList.list.length; index++) {
        let path = pathList.list[index];
        document.getElementById(pathList.name + index + '').addEventListener("click", () => {
            setSelectedPath(path)
        });
    }
}

// set selected path 
function setSelectedPath(path) {
    localStorage.setItem('selectedPath', JSON.stringify(path))
}

function initMainPage() {
    jsonpRequest("http://eng1003.monash/api/campusnav/", pathData);
}