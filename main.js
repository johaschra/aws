/* Wetterstationen Euregio Beispiel */

// Innsbruck
let ibk = {
    lat: 47.267222,
    lng: 11.392778,
    zoom: 11,
};

// Karte initialisieren
let map = L.map("map").setView([ibk.lat, ibk.lng], ibk.zoom);

// thematische Layer
let overlays = {
    stations: L.featureGroup(),
    temperature: L.featureGroup(),
    wind: L.featureGroup(),
    snow: L.featureGroup(),
    direction: L.featureGroup().addTo(map),
}

// Layer control
// aufgeteilt in Base layers und Overlays
L.control.layers({
    "Relief avalanche.report": L.tileLayer(
        "https://static.avalanche.report/tms/{z}/{x}/{y}.webp", {
        attribution: `© <a href="https://sonny.4lima.de">Sonny</a>, <a href="https://www.eea.europa.eu/en/datahub/datahubitem-view/d08852bc-7b5f-4835-a776-08362e2fbf4b">EU-DEM</a>, <a href="https://lawinen.report/">avalanche.report</a>, all licensed under <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>`,
        maxZoom: 12,
    }).addTo(map),
    "OpenStreetMap": L.tileLayer.provider("OpenStreetMap.Mapnik"),
    "OpenTopoMap": L.tileLayer.provider("OpenTopoMap"),
    "Esri WorldImagery": L.tileLayer.provider("Esri.WorldImagery"),

}, {
    "Wetterstationen": overlays.stations,
    "Temperatur": overlays.temperature,
    "Wind": overlays.wind,
    "Schneehöhen": overlays.snow,
    "Windgeschwindigkeit & Richtung": overlays.direction,
}).addTo(map);

// Maßstab
L.control.scale({
    imperial: false,
}).addTo(map);



// Rainviewer

// Change default options
L.control.rainviewer({ 
    position: 'bottomleft',
    nextButtonText: '>',
    playStopButtonText: 'Play/Stop',
    prevButtonText: '<',
    positionSliderLabelText: "Hour:",
    opacitySliderLabelText: "Opacity:",
    animationInterval: 500,
    opacity: 0.5
}).addTo(map);

// Wetterstationen
async function loadStations(url) {
    let response = await fetch(url); // await -> warte erst bis die Daten da sind
    let jsondata = await response.json(); //dann die Daten in json umwandeln
    //console.log(jsondata);

    // Wetterstationen mit Icons und Popups
    L.geoJSON(jsondata, {
        attribution: 'Datenquelle: <a href= ""> AWS </a>',
        pointToLayer: function (feature, latlng) {
            //console.log(feature.properties);
            let iconName = 'wifi.png';

            return L.marker(latlng, {
                icon: L.icon({
                    iconUrl: `icons/${iconName}`,
                    iconAnchor: [16, 37],
                    popupAnchor: [0, -37],
                })
            });


        },
        onEachFeature: function (feature, layer) {
            //console.log(feature);
            let pointInTime = new Date(feature.properties.date); //new date macht aus dem String ein Date-Objekt
            //console.log(pointInTime);
            layer.bindPopup(`
                <h4>${feature.properties.name} (${feature.geometry.coordinates[2]}m)</h4>
                    <ul>
                        <li>Temperatur: ${feature.properties.LT !== undefined ? feature.properties.LT.toFixed(1) : "-"} °C</li> <!--- this is a comment--->
                        <li>Relative Luftfeuchte : ${feature.properties.RH || "-"} %</li>
                        <li>Windgeschwindigkeit: ${feature.properties.WG || "-"} m/s</li>
                        <li>Windrichtung: ${feature.properties.WR || "-"}°</li>
                        <li>Schneehöhe: ${feature.properties.HS !== undefined ? feature.properties.HS.toFixed(1) : "-"} cm</li>
                    <ul>
                <span>${pointInTime.toLocaleString()}</span>

        `); // || "-" wird verwendet wenn 0, undifined oder false.
            //Betreiber: <a href="${feature.properties.operatorLink
            //}" target= "betreiber">${feature.properties.operator}</a>`);
        }


    }).addTo(overlays.stations);
    showTemperature(jsondata);
    showWind(jsondata);
    showSH(jsondata);
    showDir(jsondata);


}

loadStations("https://static.avalanche.report/weather_stations/stations.geojson");

function showTemperature(jsondata) {
    L.geoJSON(jsondata, {
        filter: function (feature) {
            if (feature.properties.LT > -50 && feature.properties.LT < 50) {
                return true;
            }
        },
        pointToLayer: function (feature, latlng) {
            let color = getColor(feature.properties.LT, COLORS.temperature);
            return L.marker(latlng, {
                icon: L.divIcon({
                    html: `<span style ="background-color:${color}">${feature.properties.LT.toFixed(1) || "-"}°C </span>`,
                    className: "aws-div-icon",

                }),
            });


        },

    }).addTo(overlays.temperature);
}

function showWind(jsondata) {
    L.geoJSON(jsondata, {
        filter: function (feature) {
            if (feature.properties.WG > 0 && feature.properties.WG < 500) {
                return true;
            }
        },
        pointToLayer: function (feature, latlng) {
            let color = getColor(feature.properties.WG, COLORS.wind);
            return L.marker(latlng, {
                icon: L.divIcon({
                    html: `<span style ="background-color:${color}">${feature.properties.WG.toFixed(1) || "-"}km/h</span>`,
                    className: "aws-div-icon",

                }),
            });


        },

    }).addTo(overlays.wind);
}


function showSH(jsondata) {
    L.geoJSON(jsondata, {
        filter: function (feature) {
            if (feature.properties.HS > 0 && feature.properties.HS < 1500) {
                return true;
            }
        },
        pointToLayer: function (feature, latlng) {
            //console.log(feature.properties)
            let color = getColor(feature.properties.HS, COLORS.snowheight);
            return L.marker(latlng, {
                icon: L.divIcon({
                    html: `<span style ="background-color:${color}">${feature.properties.HS.toFixed(1) || "-"}cm</span>`,
                    className: "aws-div-icon",

                }),
            });


        },

    }).addTo(overlays.snow);
}


function showDir(jsondata) {
    L.geoJSON(jsondata, {
        filter: function (feature) {
            if (feature.properties.WR > 0 && feature.properties.WR < 361) {
                return true;
            }
        },
        pointToLayer: function (feature, latlng) {
            let color = getColor(feature.properties.WG, COLORS.wind);
            // round direction values to degrees because wind direction measurements are quite uncertain
            //let dir = feature.properties.WR !== undefined ? feature.properties.WR.toFixed(0) : "-";
            let dir = feature.properties.WR !== undefined ? feature.properties.WR.toFixed(0) : "-";
            
            //console.log(feature.properties.WR);
            return L.marker(latlng, {
                icon: L.divIcon({
                    html: `<span><i style = "transform: rotate(${feature.properties.WR}deg) ; color:${color}" class = "fa-solid fa-circle-arrow-down"></i>
                            </span>`,
                    className: "aws-div-icon-winddir",

                }),
            });


        },

    }).addTo(overlays.direction);
}


//let testColor = getColor(-)

function getColor(value, ramp) {
    for (let rule of ramp) {
        //console.log("rule", rule);
        if (value >= rule.min && value < rule.max) {
            return rule.color; // return is an automatic break
        }
    }
}

