var map;
var marker;
var startMarker;
var endMarker;
var poly;

function locateUser() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            let latitude = position.coords.latitude;
            let longitude = position.coords.longitude;
            let accuracy = position.coords.accuracy;
            console.log(map);
            if (map) {
                map.setCenter(new google.maps.LatLng(latitude, longitude));
            } else {
                map = new google.maps.Map(document.getElementById('addRouteMap'), {
                    center: { lat: latitude, lng: longitude },
                    zoom: 18
                });
                poly = new google.maps.Polyline({
                    strokeColor: '#FF0000',
                    strokeOpacity: 1.0,
                    strokeWeight: 2
                });
                poly.setMap(map);
                addMarker(map, map.getCenter());
            }
        });
    } else {

    }
}

function addMarker(map, position) {
    if (marker) {
        marker.setMap(null);
    }
    marker = new google.maps.Marker({
        map: map,
        draggable: true,
        animation: google.maps.Animation.DROP,
        position: position,
        zIndex: 3
    });
}

function initMap() {
    locateUser();
}

function addPoly(marker) {
    var path = poly.getPath();
    path.push(marker.getPosition());
    if (path.length == 1) {
        startMarker = new google.maps.Marker({
            map: map,
            label: "start",
            draggable: false,
            animation: google.maps.Animation.DROP,
            position: marker.getPosition(),
            zIndex: 1
        });
    }
    if (path.length > 1) {
        if (endMarker) {
            removeEndMarker();
        }
        endMarker = new google.maps.Marker({
            map: map,
            label: "end",
            draggable: false,
            animation: google.maps.Animation.DROP,
            position: marker.getPosition(),
            zIndex: 1
        });
    }
}

function removeLastPoly() {
    var path = poly.getPath();
    path.removeAt(path.length - 1);
    if (!path.length) {
        removeStartMarker();
    }

    removeEndMarker();
    if (path.length > 1) {
        endMarker = new google.maps.Marker({
            map: map,
            label: "end",
            draggable: false,
            animation: google.maps.Animation.DROP,
            position: path.getAt(path.length - 1),
            zIndex: 1
        });
    }
}

function removeStartMarker() {
    startMarker.setMap(null);
}

function removeEndMarker() {
    endMarker.setMap(null);
}

function getInputValue(inputId) {
    let value = document.querySelector('#' + inputId).value;
    return value ? value : null;
}



function initDialogListener() {
    let dialog = document.querySelector('dialog');
    dialog.querySelector('#close').addEventListener('click', closeDialog);
    dialog.querySelector('#save').addEventListener('click', saveRoute);
}

function showDialog() {
    let dialog = document.querySelector('dialog');
    dialog.showModal();
}

function closeDialog() {
    let dialog = document.querySelector('dialog');
    dialog.close();
}

function saveRoute() {
    let title = getInputValue('routeTitle');

    if (!title) {
        displayMessage('Please enter title of the route', 1000);
        return;
    }

    var path = poly.getPath();
    if (path.length > 0) {
        let locations = [];
        for (let i = 0; i < path.length; i++) {
        	let location = path[i];
        	locations.push({ lat: location.lat(), lng: location.lng() });
        }
        let userSavedPath = JSON.parse(localStorage.getItem(USER_ROUTE));

        if (!userSavedPath) {
            userSavedPath = [];
        }

        userSavedPath.push({
            title: title,
            locations: locations
        });

        localStorage.setItem(USER_ROUTE, JSON.stringify(userSavedPath));
        closeDialog();
    }
}

function addListeners() {
    document.getElementById('locateMe').addEventListener('click', locateUser);
    document.getElementById('placeIcon').addEventListener('click', () => {
        addMarker(map, map.getCenter());
    });
    document.getElementById('addPath').addEventListener('click', () => {
        addPoly(marker);
    });
    document.getElementById('removePath').addEventListener('click', () => {
        removeLastPoly();
    });
    document.getElementById('saveRoute').addEventListener('click', () => {
        showDialog();
    });
    initDialogListener();
}

addListeners();