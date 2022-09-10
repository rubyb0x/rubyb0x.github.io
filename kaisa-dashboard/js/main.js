//data base_url
var url = 'https://rubyb0x.github.io/kaisa-dashboard/data/map.geojson';

//map options
var mapOptions = {
  center: [6.7029, 121.9690],
  zoom: 8,
};

var map = L.map('map', mapOptions);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var geojsonLayer = new L.GeoJSON.AJAX(url);
geojsonLayer.addTo(map);
