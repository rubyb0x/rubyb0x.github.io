//data urls
var mapurl = 'https://rubyb0x.github.io/kaisa-dashboard/data/map.geojson';
var brgydist = 'https://rubyb0x.github.io/kaisa-dashboard/data/cf_brgydist.json';

// color from https://colorbrewer2.org/#type=sequential&scheme=RdPu&n=6
function getColor(d) {
    return d > 200 ? '#7a0177' :
           d > 100 ? '#c51b8a' :
           d > 50  ? '#f768a1' :
           d > 20  ? '#fa9fb5' :
           d > 10  ? '#fcc5c0' :
                     '#feebe2';
}

// style for brgy distribution geojson layer
function style(feature) {
    return {
        fillColor: getColor(feature.properties.cfbgycount),
        weight: 0.5,
        opacity: 1,
        color: '#ffffff',
        dashArray: '3',
        fillOpacity: 0.8
    };
}

// 1. Main map plus options
var mapOptions = {
  center: [6.7029, 121.9690],
  zoom: 8,
};

var map = L.map('map', mapOptions);
map.attributionControl.setPrefix("Leaflet");

// add baselayer tiles
L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.png', {
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> | Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors and MBHTE'
}).addTo(map);


// 2. Load geojson and data layers via leaflet-ajax

$.when(
	$.getJSON(mapurl),
	$.getJSON(brgydist)
).done(function(responseGeojson, responseData) {
	var data = responseData[0]
	var geojson = responseGeojson[0]

	// Create hash table for easy reference
	var dataHash = {}
	data.forEach(function(item) {
		if(item.name_desc) dataHash[item.name_desc] = Number(item.male) + Number(item.female);
	})
	console.log(dataHash);
	// Add value from hash table to geojson properties
	geojson.features.forEach(function(item) {
		item.properties.cfbgycount = +dataHash[item.properties.Bgy_Name] || null
	})

	console.log(geojson);
  L.geoJSON(geojson, {
    style: style,
    attribution: "<br />All barangay boundaries are indicative only (Open Bangsamoro Data,2019)."
  }).addTo(map);
})

// 3. Add interaction
// 4. Add legend
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 10, 20, 50, 100, 200],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(map);
