const map = L.map('map').setView([0, 0], 2);

const freeingSpacesJSON = freeingSpacesFromCSV.map(convertToGeoJSON);

// L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 18,
	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
		'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
	id: 'mapbox/light-v9',
	tileSize: 512,
	zoomOffset: -1,
	boundary: 'aboriginal_lands'
}).addTo(map);

function onEachFeature(feature, layer) {
	console.log({feature})
	const props = feature.properties;
	let text = props.url ? `<a href=${props.url} target="_blank">${props.admin}</a>` : props.admin;
	if (props.description) {
		text += `<br/><em>${props.description}</em>`;
	}
	layer.bindPopup(text);
}

L.geoJSON(freeingSpacesJSON, {
	style: function (feature) {
		return feature.properties && feature.properties.style;
	},
	onEachFeature: onEachFeature,
	pointToLayer: function (feature, latlng) {
		return L.circleMarker(latlng, {
			radius: 4,
			fillColor: "#ff7800",
			color: "#000",
			weight: 1,
			opacity: 1,
			fillOpacity: 0.8
		});
	}
}).addTo(map);