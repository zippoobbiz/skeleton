var MONASH_ROUTE = "monash.eng1003.navigationApp";
var USER_ROUTE = "user.eng1003.navigationApp";

// pahtlist class
class PathList {
    constructor(name) {
        // path array
        this._list = [];
        // pathlist name
        this._name = name;
    }

    get name() {
        return this._name;
    }

    set name(name) {
        this._name = name;
    }

    add(path) {
        this._list.push(path);
    }

    get list() {
        return this._list;
    }
}

class Path {
    constructor(locations, title) {
        // there is no native support for private properties with ES6 classes.
        // use _ to indicate it's a private variable
        this._locations = locations;
        this._title = title;
    }

    get title() {
        return this._title;
    }

    get locations() {
        return this._locations;
    }

    set title(title) {
        this._title = title;
    }

    set locations(locations) {
        this._locations = locations;
    }

    numberOfTurns() {
        return this._locations.length;
    }

    // get distacne of a path
    distance() {
        let distance = 0;
        let lastLatLng = null;
        for (var i = 0; i < this._locations.length; i++) {
            let location = this._locations[i];
            let latLng = new google.maps.LatLng(location);
            if (lastLatLng) {
                // add all distance between each waypoint
                distance += google.maps.geometry.spherical.computeDistanceBetween(lastLatLng, latLng);
            }
            lastLatLng = latLng;
        }
        return Math.round(distance * 100) / 100;
    }

    // formated string used to show path information
    summary() {
        return this.distance() + ' meters ' + this.numberOfTurns() + ' turns';
    }

    // based on index, get the item in location and return a google map lanlng object
    // if not valid index, return null
    getWayPointAt(index) {
        let location = this._locations[index];
        if (location) {
            return new google.maps.LatLng(location.lat, location.lng);
        }
        return null;
    }
}