
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
    if (typeof (Storage) !== "undefined"){
        pathStringObject = JSON.stringify(savedPaths);
     }else{
        console.log("Error: Trying with another browser.")
    }
};


// Dirextions class used in path class



// Create a Path class

let MonashRoutesElement = document.getElementById('routes-list');
let routes = [];

// Make the request


function Monashroutes(routesArray)
{
    routes = roesArray;

    // List view section heading: Flight list
    var listHTML = "";

    // TODO: Part 1 - Add code here to iterate over the 'routes' array and
    //       create HTML list items for each route, as below.
    for (var i=0; i<routes.length; i++)
	{
    // HTML format of list item is:
    //
    //   <tr> <td onmousedown=\"listRowTapped("+i+")\" class=\"full-width mdl-data-table__cell--non-numeric\">"[SOURCE AIRPORT] -> [DEST AIRPORT]
    //   <div class="subtitle">[AIRLINE CODE], Stops: [STOPS]</div></td></tr>
    //
    // And sample JavaScript code that would generate the HTML above is:
    //
    listHTML += "<tr> <td onmousedown=\"listRowTapped("+i+")\" class=\"full-width mdl-data-table__cell--non-numeric\">" + Monashroutes[i].title + " &rarr; " + 
    //listHTML += "<div class=\"subtitle\">" + routes[i].airline + ", Stops: " + routes[i].stops +"</div></td></tr>";


    // Insert the list view elements into the flights list.
    MonashRoutesElement.innerHTML = listHTML;
	}

    