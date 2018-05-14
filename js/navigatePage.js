// Map Initialisation callback.  Will be called when Maps API loads.
var ACCURACY = 13;
class Navigator {

    // init variables
    constructor() {
        this.map = null;
        // watch position options
        this.options = {
            enableHighAccuracy: true,
            timeout: 1200000,
            maximumAge: 0
        };
        // next waypoint index is used to track which waypoint user need to reach
        this.nextWayPointIndex = 0;
        // get user selected path
        this.path = this.getSelectedPath();
        // user marker on map
        this.marker = null;
        // accuracy circle
        this.circle = null;
        this.movementHistory = [];
        this.direction = {
            'SR': {
                text: "Turn slightly right",
                img: "images/slight_right.svg",
            },
            'R': {
                text: "Turn right",
                img: "images/right.svg",
            },
            'SL': {
                text: "Turn slightly left",
                img: "images/slight_left.svg",
            },
            'L': {
                text: "Turn left",
                img: "images/left.svg",
            },
            'S': {
                text: "Head straight",
                img: "images/straight.svg"
            },
            'U': {
                text: "U turn",
                img: "images/uturn.svg"
            }
        }
    }

    createMarker(options) {
        return new google.maps.Marker(options);
    }

    createCircle(options) {
        return new google.maps.Circle(options);
    }

    // convert distance to a more user friendly format
    convertDistance(distance) {
        return (distance / 1000) > 1 ? (distance / 1000).toFixed(1) + " km" :
            distance.toFixed(0) + " m";
    }

    // convert time to a more user friendly format
    converTime(time) {
        if (time == 0) {
            return 'Calculating....'
        }
        let hr = Math.floor(time / 3600);
        let min = Math.floor(time % 3600 / 60);
        let sec = Math.floor(time % 3600 % 60);

        let hrTxt = hr > 0 ? hr + " hr " : "";
        let minTxt = min > 0 ? min + " min " : "";
        let secTxt = sec + " sec";
        return (hrTxt + minTxt + secTxt);
    }

    // calculate distance between two points
    calculateDistance(from, to) {
        return google.maps.geometry.spherical.computeDistanceBetween(
            from, to);
    }

    // calculate heading between two points
    calculateHeading(from, to) {
        return google.maps.geometry.spherical.computeHeading(
            from, to);
    }

    // draw poly line on the map, return a new Polyline object
    drawPoly(coordinates) {
        return new google.maps.Polyline({
            path: coordinates,
            geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 2
        });
    }

    // get user selected path
    getSelectedPath() {
        let path = JSON.parse(localStorage.getItem('selectedPath'));
        if (path) {
            path = new Path(path._locations, path.title);
            return path;
        }
        return null;
    }

    // get distance user traveled based on movement history
    getDistanceTravled() {
        let distance = 0;
        let lastLatLng = null;
        for (var i = 0; i < this.movementHistory.length; i++) {
            let movement = this.movementHistory[i];
            let latLng = movement.latLng;
            if (lastLatLng) {
                distance += google.maps.geometry.spherical.computeDistanceBetween(lastLatLng, latLng);
            }
            lastLatLng = latLng;
        }
        return Math.round(distance * 100) / 100;
    }

    // calculate distance remaining based on user current location and waypoints left.
    getDistanceRemaining(currentPosition) {
        // get distance that from current location to next waypoint
        let distance = google.maps.geometry.spherical.computeDistanceBetween(
            currentPosition.latLng, this.path.getWayPointAt(this.nextWayPointIndex));
        // add distance from next waypoint to destination
        for (let i = this.nextWayPointIndex, j = this.path.locations.length - 1; i < j; i++) {
            distance += google.maps.geometry.spherical.computeDistanceBetween(
                this.path.getWayPointAt(i), this.path.getWayPointAt(i + 1));

        }

        return Math.round(distance * 100) / 100;
    }



    getAverageSpeed(distance, time) {
        if (time > 0) {
            return (distance / time).toFixed(0);
        }
        return 0;
    }

    getTimeRemaining(distance, speed) {
        if (speed == 0) {
            return 0;
        }
        return (distance / speed).toFixed(0);
    }
    // update marker on the map
    updateMarker(options) {
        this.marker.setOptions(options);
    }
    // update accuracy circle on the map
    updateCircle(options) {
        this.circle.setOptions(options);
    }

    // success callback for watch position
    positionSuccess(position) {
        if (!this.path) {
            return;
        }
        // user current position
        let currentPosition = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            time: position.timestamp,
            latLng: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
        }


        // add current position to movement history
        this.addToMovementHistory(currentPosition);


        // first time running
        if (!this.map) { // map not created
            // create map
            this.map = new google.maps.Map(document.getElementById('map'), {
                center: currentPosition.latLng,
                zoom: 18
            });
            // draw polyline on map
            this.drawPoly(this.path.locations).setMap(this.map);

            // create marker on map
            this.marker = this.createMarker({
                map: this.map,
                position: currentPosition.latLng,
                icon: {
                    path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                    scale: 10,
                    anchor: new google.maps.Point(0, 3),
                    rotation: 0,
                    fillColor: "#0000FF",
                    strokeWeight: 0,
                    strokeOpacity: 0.00001,
                    fillOpacity: 1,
                },
            });

            // create accuracy circle on map
            this.circle = this.createCircle({
                center: currentPosition.latLng,
                radius: currentPosition.accuracy,
                map: this.map,
                fillColor: '#0000FF',
                fillOpacity: 0.5,
                strokeColor: '#0000FF',
                strokeOpacity: 1.0
            });
            this.map.fitBounds(this.circle.getBounds());
        }

        // set map center to user current location
        this.map.setCenter(currentPosition.latLng);

        // accuracy is too big
        if (position.coords.accuracy > ACCURACY) {
            displayMessage("Accuracy not suitable", 1000);
            return;
        }

        // get user's device heading
        let deviceHeading = this.calculateHeading(this.getPreviousMovement().latLng, currentPosition.latLng);

        // update marker heading based on device heading
        this.updateMarker({
            position: currentPosition.latLng,
            map: this.map,
            icon: {
                path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                rotation: deviceHeading,
                scale: 6,
                anchor: new google.maps.Point(0, 3),
                fillColor: "#0000FF",
                strokeWeight: 0,
                strokeOpacity: 0.00001,
                fillOpacity: 1,
            }
        });
        this.marker.setMap(this.map);

        // udpate accuracy circle
        this.updateCircle({
            fillColor: currentPosition.accuracy < ACCURACY ? "#00FF00" : "#FF0000",
            center: currentPosition.latLng,
            radius: currentPosition.accuracy,
        });

        // get next waypoint
        let nextWayPoint = this.path.getWayPointAt(this.nextWayPointIndex);

        // if reached next waypoint
        if (this.calculateDistance(
                currentPosition.latLng, nextWayPoint) < currentPosition.accuracy) {
            // if not more nextway point user reached the destination
            if (++this.nextWayPointIndex > this.path.locations.lenght - 1) {
                displayMessage("reached destination", 1000);
                return;
            }

            // move the next waypoint
            nextWayPoint = this.path.getWayPointAt(this.nextWayPointIndex);
        }
        // get waypoint heading
        let wayPointHeading = this.calculateHeading(currentPosition.latLng, nextWayPoint) - deviceHeading;

        // update direction icon
        this.updateDirectionIndicator(wayPointHeading);

        let distTravelled = this.getDistanceTravled();

        let distRemaining = this.getDistanceRemaining(currentPosition);
        let travelTime = (currentPosition.time - this.movementHistory[0].time) / 1000;
        let avgSpeed = this.getAverageSpeed(distTravelled, travelTime);

        let timeRemaining = this.getTimeRemaining(distRemaining, avgSpeed);

        // update time speed info.
        this.updateInfo({
            avgSpeed: avgSpeed,
            timeRemaining: timeRemaining,
            distRemaining: distRemaining
        });

    }


    updateInfo(options) {
        document.getElementById("avgSpeed").innerHTML =
            options.avgSpeed + " m/s";
        document.getElementById("timeRemaining").innerHTML =
            this.converTime(options.timeRemaining);
        document.getElementById("distRemaining").innerHTML =
            this.convertDistance(options.distRemaining);
    }



    addToMovementHistory(movement) {
        this.movementHistory.push(movement);
    }

    // get last item in movement history
    getPreviousMovement() {
        if (this.movementHistory.length) {
            return this.movementHistory[this.movementHistory.length - 1];
        }
        return null;
    }


    updateDirectionIndicator(heading) {
        let type = '';
        if (heading < 0)
            heading = 360 + heading;
        if (heading >= 20 && heading < 70) {
            type = 'SR';
        } else if (heading >= 70 && heading < 110) {
            tyep = "R";
        } else if (heading >= 250 && heading < 290) {
            type = "L";
        } else if (heading >= 290 && heading < 340) {
            type = "SL";
        } else if (heading >= 340 || heading < 20) {
            type = "S";
        } else if (heading >= 110 && heading < 250) {
            type = "U";
        }
        let direction = this.direction[type];
        // based on type, update the direction icon 
        document.getElementById("directionImg").src = direction.img;
        document.getElementById("nextAction").innerHTML = direction.text;
    }

    positionFail(error) {
        let errorMessage = "";
        switch (error.code) {
            case 1:
                errorMessage = "Permission denied. Turn on GPS and refresh the page.";
                break;
            case 2:
                errorMessage = "Position unavailable. Turn on GPS and refresh the page.";
                break;
            case 3:
                errorMessage = "Location timed out";
                break;
            default:
                errorMessage = "Error unknown. Cannot determine location.";
                break;
        }
        displayMessage(errorMessage, 10000);
    }

    // enter point for navigation
    startNavigate() {
        if (navigator.geolocation) {
            navigator.geolocation.watchPosition((position) => {
                this.positionSuccess(position);
            }, (error) => {
                this.positionFail(error);
            }, this.options);
        } else {
            displayMessage("Geolocation is not supported by this browser.", 10000);
        }
    }

}

// callback for google map api
function startNavigate() {
    let engNavigator = new Navigator();
    engNavigator.startNavigate();
};