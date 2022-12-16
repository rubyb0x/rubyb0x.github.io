//data urls
var mapurl = 'https://rubyb0x.github.io/kaisa-dashboard/data/map.geojson';
var brgydist = 'https://rubyb0x.github.io/kaisa-dashboard/data/cf_brgydist.json';

// color from https://colorbrewer2.org/#type=sequential&scheme=RdPu&n=6
function getColor(d) {
    return d > 100 ? '#7a0177' :
           d > 50 ? '#c51b8a' :
           d > 20  ? '#f768a1' :
           d > 10  ? '#fa9fb5' :
           d > 0  ? '#fcc5c0' :
                    '';
                     //'#feebe2';
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
  zoomControl: false,
};

var map = L.map('map', mapOptions);
map.attributionControl.setPrefix("Leaflet | Bahaghari Maps");

var zoom = L.control.zoom ({position: 'topright'});
zoom.addTo(map);

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

	// Add value from hash table to geojson properties
	geojson.features.forEach(function(item) {
		item.properties.cfbgycount = +dataHash[item.properties.Bgy_Name] || null
	})

  L.geoJSON(geojson, {
    style: style,
    attribution: "<br />All barangay boundaries are indicative only (Open Bangsamoro Data,2019)."
  }).addTo(map);
})

// 3. Add legend
var legend = L.control({position: 'bottomleft'});

legend.onAdd = function (map) {

  var div = L.DomUtil.create('div', 'info legend'),
      grades = [1, 10, 20, 50, 100],
      labels = [];


  div.innerHTML += '<h3>Legend</h3><h4>Children mapped per barangay</h4>'

  // loop through our density intervals and generate a label with a colored square for each interval
  for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
          '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
          grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
  }

    return div;
};

legend.addTo(map);

// 4. Add Info box to include totals on child finding activity

var info = L.control({ position: 'topleft' });

info.onAdd = function (map) {
  var div = L.DomUtil.create('div','info');
  div.innerHTML = '<h1><a href="https://www.facebook.com/kaisacampaign">KaISA to Reach Every Child Campaign</a></h1>' +
                  '<h2>How many children have been surveyed?</h2>' +
                  '<p><span style="font-size: 3em;">22,005 children mapped</span><br/>' +
                  '<p /> 10,882 female' +
                  '<br />11,123 male</p>';

  return div;
}

info.addTo(map);
