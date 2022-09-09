//data base_url
var url = 'data/bndry_basilan_OB2019.geojson';
//var url = 'data/boundaries_barmm_muni_OB2019.geojson';

//map options
var mapOptions = {
  center: [6.7029, 121.9690],
  zoom: 8,
};

var map = L.map('map', mapOptions);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// set style function that sets fill color property
function style(feature) {
    return {
        fillColor: 'green',
        fillOpacity: 0.5,
        weight: 2,
        opacity: 1,
        color: '#ffffff',
        dashArray: '3'
    };
}
	var highlight = {
		'fillColor': 'yellow',
		'weight': 2,
		'opacity': 1
	};

// add popup description for each feature
function forEachFeature(feature, layer) {

        var popupContent = "<p><b>Region: </b>"+ feature.properties.Reg_Name +
            "</br>Province: "+ feature.properties.Pro_Name +
            "</br>Municipality: "+ feature.properties.Mun_Name + '</p>';

        layer.bindPopup(popupContent);

        layer.on("click", function (e) {
            munLayer.setStyle(style); //resets layer colors
            layer.setStyle(highlight);  //highlights selected.
        });
}

// null variable to hold tileLayer
var munLayer = L.geoJson(null, {onEachFeature: forEachFeature, style: style});

	$.getJSON(url, function(data) {
        munLayer.addData(data);
    });

 munLayer.addTo(map);
