

// Earthquakes & Tectonic Plates GeoJSON URL Variables
var earthquakesURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
var platesURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

// Initialize & Create Two Separate LayerGroups: earthquakes & tectonicPlates
var earthquakes = new L.LayerGroup();
var tectonicPlates = new L.LayerGroup();

// Define Variables for Tile Layers
var satelliteMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
});

// Define variables for our tile layers
var light = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "light-v10",
  accessToken: API_KEY
});


// Define baseMaps Object to Hold Base Layers
var baseMaps = {
    "Satellite": satelliteMap,
    "Grayscale": light

};

// Create Overlay Object to Hold Overlay Layers
var overlayMaps = {
    "Earthquakes": earthquakes,
    "Tectonic Lines": tectonicPlates
};

// Create Map, Passing In satelliteMap & earthquakes as Default Layers to Display on Load
var myMap = L.map("map", {
    center: [39.8283, -98.5795],
    zoom: 4,
    layers: [satelliteMap, earthquakes]
});// Create a Layer Control + Pass in baseMaps and overlayMaps + Add the Layer Control to the Map


L.control.layers(baseMaps, overlayMaps,{
    collapsed:true
}).addTo(myMap);

var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// get the d3 data
d3.json(url, function(response) {

    // color code based on magnitude
    for (var i = 0; i < response.features.length; i++){
        var color = ""
        if (response.features[i].properties.mag > 5){
            color = "#FF6347"
        }
        else if (response.features[i].properties.mag > 4){
            color = "#FF8C00"
        }
        else if (response.features[i].properties.mag > 3){
            color = "#FFA500"
        }
        else if (response.features[i].properties.mag > 2){
            color = "#FFD700"
        }
        else if (response.features[i].properties.mag > 1){
            color = "#FFDAB9"
        }
        else {
            color = "#7CFC00"
        }
        // shortening the code 
        var location = response.features[i].geometry;
        // creating the circles
        L.circle([location.coordinates[1], location.coordinates[0]],{
            fillOpacity: 0.75,
            color: color,
            fillColor: color,
            // adjust radius
            radius: response.features[i].properties.mag * 50000
        }).bindPopup("<h1>" + response.features[i].properties.place + "</h1> <hr> <h3>Magnitue: "+ response.features[i].properties.mag + "</h3>")
        //   This adds to the earthquake filter/checkbox
          .addTo(earthquakes)
        //   This add the circles to the maps
          .addTo(myMap)
    }
    // Retrieve Tectonic Plates
    d3.json(platesURL, function(plateData){
        L.geoJson(plateData, {
            color: "white",
            weight: 3
        }).addTo(tectonicPlates)
        tectonicPlates.addTo(myMap)
    })


    // Set Up Legend
    var legend = L.control({ position: "bottomright" });

    legend.onAdd = function() {
      var div = L.DomUtil.create("div", "legend");
      div.innerHTML += "<h4>Magnitude</h4>";
      div.innerHTML += '<i style="background: #7CFC00"></i><span>0-1</span><br>';
      div.innerHTML += '<i style="background: #FFDAB9"></i><span>1-2</span><br>';
      div.innerHTML += '<i style="background: #FFD700""></i><span>2-3</span><br>';
      div.innerHTML += '<i style="background: #FFA500"></i><span>3-4</span><br>';
      div.innerHTML += '<i style="background: #FF8C00"></i><span>4-5</span><br>';
      div.innerHTML += '<i style="background: #FF6347"></i><span>5+</span><br>';
    //   https://codepen.io/haakseth/pen/KQbjdO
      
    
      return div;
    };
    
    legend.addTo(myMap);
    
})
