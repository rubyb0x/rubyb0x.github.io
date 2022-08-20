var mapOptions = {
  center: [6.7029, 121.9690],
  zoom: 8
}

var map = L.map('map', mapOptions)

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);
