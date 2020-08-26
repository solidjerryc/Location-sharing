changeTheSizeOfMap();

var layer = 0;

var lat=47.81;
var lon=13.04;
var pointObject;

// The view of the map
var view = new ol.View({
    center: ol.proj.fromLonLat([13.04, 47.81]),
    zoom: 13
});

// Create a map for the base map
var map = new ol.Map({
    target: 'map',
    layers: [
        new ol.layer.Tile({
            // The base map is cartomap. Set the tile pixel ratio to fit the high resolution
            source: new ol.source.XYZ({
                url: 'https://a.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}@2x.png',
                tilePixelRatio: 2
            })
        })
    ],

    controls:
        ol.control.defaults().extend([
            new ol.control.ScaleLine()
        ])
});

/**
 * Create a point object by given data. 
 * @para info a list of name, latitude and longitude
 */
function createPoint(info) {
    var xy = ol.proj.transform([info[1], info[2]], 'EPSG:4326', 'EPSG:3857');
    var iconFeature = new ol.Feature({
        geometry: new ol.geom.Point(xy),
    });

    var iconStyle = new ol.style.Style({
        text: new ol.style.Text({
            text: info[0],
            offsetY: 5,
            fill: new ol.style.Fill({
                color: '#FF5733'
            })
        }),
        image: new ol.style.Icon({
            anchor: [0.5, 48],
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QA/wD/AP+gvaeTAAAEPElEQVRogdWZTWhcVRTHf+eNVavU6kpbbayKIloFPzCVzjxFYzUBEdHgQpCqUarW1qpgBBEUF4KlC6GIYhbisl3YLhqx1SbzksaULMSSiiLaFtMhLkr9SMtkMnNcTGxiM/e9c997fv2Wc/7nnv/h3rnv3fvgf47kNZCGrKBBJ0IRuB5oAy4EFDiBcARlHCGiTr8McyyPupkb0CL3IbwChEBgTGsA+1DeliH2ZqmfuoFZ428At2UxAIygvJ62Ee8GtIOlVNkGPJqmYAwf0eB5GeY3nySvBjTkahrsQrjWz5uZQxR4QAb43ppgbkBDbqDBHoSL03kzU0G4W8p8YxGbGtA1LCdgFLgskzU7xyjQLgP8lCRM3DX0FhZRYCf/nHmA5dTZoXdyVpIweds7j9dQbs3Flh/t1Hk1SRS7hLRIG8K3wLkehQ8i9FFnL+dzGIApVlKggwY9CKs8xjrJDNfICBMuQXwDIdtQnjUWqwKbiXhfmg+qheN1U2CS9ShbgbNNowrvSplN7rADXcMSAiaAJYYyVQI6ZZB9Fk8achdKP7YmfmExl8pnTLUKuv8DAWuxmQd4wWoeQMp8AbxklC/lFB2uoLsB5R5jgYNEfGDUznEJ7wHjRvW9roC7AeEm09DKh641H4dspw70GeU3ugJx2+gVNicZ3iYL7DEqr3IF4hq4wGjiqNHEQmocMSovcgXiGqgbTaQ/U8yYc2uuQFwDP5uGDlhhNLGQxbQZlU4vcQ3YloaYd6uF1I256l5qcQ0MmwZv0KPdFEza+Z6aOT0mccB+d8htLDINLqxikvUm7XwqPAdcZ9Kq24v7VaKTc/idCjE7wDymgS6J+Nzkp0gHwm5gkUF+nOMsk3GmWwWdMyD9VIEdFkM032l2a4kNcctJuylokY0e5kHZ7jIPya/T7QhfmgrNMQ70zT6kDs/+tpIZ1iI8iXXZzNEuEQdcwcR9WEtEQNGzaF6UJeKOOEHyiUx4Jzc7vihbkiS2Q32J/cDtmQ35cYCI1dK8mnRiuwoUenOx5ENAb5L5psyAlCkDOzObsvOJ9YBkvYwFZSO0PtblzEmEF61icwMyxFGEt9J58kB5U8r8aJXbZ6Cp3gKM+HoyI4xxiq1+KZ5okSsRvsJ+4LcyhXKzDPGdT5LfDAAyxA8oL/vmGdjsax6yfOAI2YVyf9r8M/iUiC7Ltnkm3jNwmipPAZXU+XNUmGZdGvOQoQEZZZKAh8D9pmigRsAjMspk2gHSzwAgg4z47Nkt2CSDxoOTy0OW5D/RkD6UJzzTPpaIx7LWzjQDp6mxAWHMrBfGKPB0HqXz+9BdYhnNh9zlCRUnCFht+XxkIZ8ZACSiAnQBJ2Jkv6J05WUecmwAQCIOoTxI652pRsDDEvF1njVzbQBAhhhAeJy/3lg3ENbJoPky999HSzyjJVRLNLSU4t7ov4CG9Gr4957m/gCUKBdIHeoOkAAAAABJRU5ErkJggg=="
        })
    });
    iconFeature.setStyle(iconStyle);
    return iconFeature;
}

/**
 * Create a vector layer from text from AJAX request
 * @param {String} xy xy points string 
 * @returns vectorLayer of Points
 */
function createVectorLayerFromText(xy) {
    var points = [];
    for (let index = 0; index < xy.length; index++) {
        points.push(createPoint(xy[index]));
    }

    var vectorSource = new ol.source.Vector({
        features: points
    });
    // add the source to the layer
    var vectorLayer = new ol.layer.Vector({
        title: "Points of Interest",
        source: vectorSource
    });
    return vectorLayer;
    //map.addLayer(vectorLayer);
}

/**
 * Draw the points on map by using the text from the server.
 * @param {String} text 
 */
function drawPoints(text) {
    var pointText = text;
    pointText = pointText.split("(").join("[");
    pointText = pointText.split(")").join("]");
    pointObject = eval(pointText);
    if (layer != 0) {
        map.removeLayer(layer);
    }
    layer = createVectorLayerFromText(pointObject);
    map.addLayer(layer);
}

map.setView(view);

/**
 * Get geolocation from HTML5 api. This request user to allow the location privilege
 * This need HTTPS protocol when deploy on a server.
 */
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(sendGeoData);
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}

/**
 * This is a test function. Write the position on web page
 * @param {*} position Point
 */
function showPosition(position) {
    x.innerHTML = "Latitude: " + position.coords.latitude +
        "<br>Longitude: " + position.coords.longitude;
}

/**
 * Ajax function. Upload the position of the current user and receive 
 * the locations from the server.
 * @param {String} url Send the request to the URL and get data from server
 */
function sendData(url) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            //document.getElementById("demo").innerHTML = this.responseText;
            drawPoints(this.responseText);
        }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
}

/**
 * Send the AJAX request to the server to get the data.
 * @param {*} position Create a function that allows upload current position to the server
 */
function sendGeoData(position) {
    lat = position.coords.latitude;
    lon = position.coords.longitude;
    url = "/upload/api?user=" + encodeURIComponent(getCookie("user")) + "&lat=" + lat.toString() + "&lon=" + lon.toString() + "&sessionid=1";
    sendData(url);
}

/**
 * Fit the extent of the point layer.
 */
function fitLayerExtent(){
    var fitEdgeRate=0.1;
    var myExtent=layer.getSource().getExtent();
    var xFit=myExtent[2]-myExtent[0];
    var yFit=myExtent[3]-myExtent[1];
    if(xFit<=100 || yFit<=100){
        locateMe();
        return;
    }
    myExtent[0]-=xFit*fitEdgeRate;
    myExtent[2]+=xFit*fitEdgeRate;
    myExtent[1]-=yFit*fitEdgeRate;
    myExtent[3]+=yFit*fitEdgeRate;
    console.log(myExtent);
    map.getView().fit(myExtent);
}

/**
 * Zoom to the user's location
 */
function locateMe(){
    var newView = new ol.View({
        center: ol.proj.fromLonLat([lon, lat]),
        zoom: 13
    });
    map.setView(newView);
}

/**
 * Calculate the real distance between two points
 * @param {*} latlng1 
 * @param {*} latlng2 
 */
function distanceBetweenPoints(latlng1, latlng2){
    var line = new ol.geom.LineString([latlng1, latlng2]).transform('EPSG:4326', 'EPSG:3857');
    return Math.round(line.getLength() * 100) / 100000;
}

/**
 * Get GPS position when the page load. And zoom to the position after loading
 */
function onLoadLocation(){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position){
            lat = position.coords.latitude;
            lon = position.coords.longitude;
            map.setView(new ol.View({
                center: ol.proj.fromLonLat([lon, lat]),
                zoom: 13
            }));
        });
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}

/**
 * Get all users and calculate the distance to the current user. Update the information to the popup window. 
 */
function getCurrentUsers(){
    var outString="<ul>";
    pointObject.forEach(element => {
        outString+="<li onclick=\"clickToMyFriend('"+element[0]+"')\">";
        outString+=element[0];
        var distance=distanceBetweenPoints([lon, lat],[element[1], element[2]]);
        if(distance==0){
            distance="Me";
        }else{
            distance=distance.toFixed(2).toString();
            distance+="km";
        }
        outString+="<div style=\"float:right;text-align:right;\">"+distance.toString()+"<div>";
        outString+="</li>";
    });
    outString+="</ul>";
    console.log(outString);
    document.getElementById("user-list").innerHTML = outString;
}

/**
 * When the name of friend is clicked, zoom to the position of friend.
 * @param {String} name 
 */
function clickToMyFriend(name){
    pointObject.forEach(element => {
        if(element[0]==name){
            // var newView = new ol.View({
            //     center: ol.proj.fromLonLat([element[1], element[2]]),
            //     zoom: 13
            // });
            // map.setView(newView);

            /**
             * Use animate to zoom smoothly.
             */
            map.getView().animate({
                center: ol.proj.fromLonLat([element[1], element[2]]),
                zoom: 5,
                duration: 2000,
                easing: ol.easing.inAndOut,
              },{
                center: ol.proj.fromLonLat([element[1], element[2]]),
                duration: 2000,
                zoom: 13,
                easing: ol.easing.inAndOut
              });
        }
    });
    window.location.href='#';
}

getLocation();
onLoadLocation();
// setTimeout(function(){locateMe()},1000);
// Set every 10 seconds as the interval that send the request.
var myInterval = window.setInterval(getLocation, 10000);

