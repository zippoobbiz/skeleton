var pathObjs = [];

function initSavedPathsFromLocalStorage(){
	if (typeof(Storage) !== "undefined") {
        pathStringObject = JSON.stringify(savedPaths);
        localStorage.setItem(APP_PREFIX, pathStringObject);
    } else {
        console.log("Error: Trying with another browser.")
    }
}
