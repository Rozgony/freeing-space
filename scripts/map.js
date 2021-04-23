const freeingSpacesJSON = freeingSpacesFromCSV.map(convertToGeoJSON);
const basicOSM = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const watercolorOSM = 'http://c.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg';
const watercolorAttr = 'Imagery © <a href="http://maps.stamen.com/#watercolor">Stamen Design</a> (CC BY 3.0)'
const topoOSM = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
const topoAttr = 'Imagery © <a href="http://opentopomap.org">opentopomap.org</a> (CC-BY-SA)'

const map = L.map('map').setView([0, 0], 2);

L.tileLayer(topoOSM, {
	maxZoom: 18,
	continuousWorld: true,
	attribution: `Map data © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ${topoAttr}`,
	tileSize: 512,
	zoomOffset: -1,
}).addTo(map);

function onEachFeature(feature, layer) {
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
			radius: 6,
			fillColor: 'red',
			color: '#000',
			weight: 1,
			opacity: 1,
			fillOpacity: 0.8
		});
	}
}).addTo(map);