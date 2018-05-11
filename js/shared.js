var MONASH_ROUTE = "monash.eng1003.navigationApp";
var USER_ROUTE = "user.eng1003.navigationApp";

class PathList {
    constructor(name) {
        this._list = [];
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

    distance() {
        let distance = 0;
        let lastLatLng = null;
        this._locations.forEach((location) => {
            let latLng = new google.maps.LatLng(location);
            if (lastLatLng) {
                distance += google.maps.geometry.spherical.computeDistanceBetween(lastLatLng, latLng);
            }
            lastLatLng = latLng;
        })
        return Math.round(distance * 100) / 100;
    }

    summary() {
        return this.distance() + ' meters ' + this.numberOfTurns() + ' turns';
    }

    getWayPointAt(index){
        
        let location = this._locations[index];
        if(location){
            return new google.maps.LatLng(location.lat, location.lng);
        }
        return null;
    }
}



