//data urls
var mapurl = 'https://rubyb0x.github.io/kaisa-dashboard/data/map.geojson';
var brgydist = 'http://localhost/data/cf_brgydist.json';

//map options
var mapOptions = {
  center: [6.7029, 121.9690],
  zoom: 8,
};

var map = L.map('map', mapOptions);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var geojsonLayer = new L.GeoJSON.AJAX(mapurl);
geojsonLayer.addTo(map);

var brgy_dist = $.getJSON(brgydist);
console.log(brgy_dist);
