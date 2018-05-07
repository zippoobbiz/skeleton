// Prefix used for local storage
var APP_PREFIX = "monash.eng1003.navigationApp";

// Array of saved path objects
var savedPaths = [];
var pathFromLocalStroage = JSON.parse(localStorage.getItem(APP_PREFIX));

// Getting path data by API
var pathData = {
    campus: "clayton",
    callback: "pathResponse"
};

jsonpRequest("http://eng1003.monash/api/campusnav/", pathData);

// Function from week 9 lab




// Set data to local storage and savedpaths
function pathResponse(pathArray) {
    var pathStringObject;
    // Paths got from API
    savedPaths = pathArray;
    // Store paths in local storage
    if (typeof(Storage) !== "undefined") {
        pathStringObject = JSON.stringify(savedPaths);
        localStorage.setItem(APP_PREFIX, pathStringObject);
    } else {
        console.log("Error: Trying with another browser.")
    }
};


// Dirextions class used in path class



// Create a Path class with scoped variables, ulgy, but can have a so called private attribute
// class Path {
//     constructor(locations, pathTitle) {
//         // there is no native support for private properties with ES6 classes.
//         let _locations = locations;
//         let _pathTitle = pathTitle;
//         this.setLocations = function(locations) { _locations = locations; };
//         this.getLocations = function() { return _locations; };
//         this.setPathTitle = function(pathTitle) { _pathTitle = pathTitle; };
//         this.getPathTitle = function() { return _pathTitle; };
//     } 
// }
// 
// 

// create path with underscores, just use a public property with an underscore prefix to assume it is a private attribue.
// access from getter and setter only 
class Path {
    constructor(locations, pathTitle) {
        // there is no native support for private properties with ES6 classes.
        this._locations = locations;
        this._pathTitle = pathTitle;
    } 

    get pathTitle(){
        return this._pathTitle;
    }

    get locations(){
        return this._locations;
    }

    set pathTitle(pathTitle){
        this._pathTitle = pathTitle;
    }

    set locations(locations){
        this._locations = locations;
    }


}


let MonashRoutesElement = document.getElementById('routes-list');
let routes = [];

// Make the request
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


function Monashroutes(routesArray) {
    routes = roesArray;

    // List view section heading: Flight list
    var listHTML = "";

    // TODO: Part 1 - Add code here to iterate over the 'routes' array and
    //       create HTML list items for each route, as below.
    for (var i = 0; i < routes.length; i++) {
        // HTML format of list item is:
        //
        //   <tr> <td onmousedown=\"listRowTapped("+i+")\" class=\"full-width mdl-data-table__cell--non-numeric\">"[SOURCE AIRPORT] -> [DEST AIRPORT]
        //   <div class="subtitle">[AIRLINE CODE], Stops: [STOPS]</div></td></tr>
        //
        // And sample JavaScript code that would generate the HTML above is:
        //
        listHTML += "<tr> <td onmousedown=\"listRowTapped(" + i + ")\" class=\"full-width mdl-data-table__cell--non-numeric\">" + Monashroutes[i].title + " &rarr; ";
        //listHTML += "<div class=\"subtitle\">" + routes[i].airline + ", Stops: " + routes[i].stops +"</div></td></tr>";


        // Insert the list view elements into the flights list.
        MonashRoutesElement.innerHTML = listHTML;
    }
}