let freeingSpacesJSON = [];
freeingSpacesFromCSV.forEach(space => {
	if (space['Name*'] && space['Type*'] && space['Longitute 1*'] && space['Latitude 1*']) {
		freeingSpacesJSON.push(convertToGeoJSON(space));
	}
});

freeingSpacesFromCSV.forEach( feature =>{
	if (feature['Latitude 2'] && feature['Longitute 2'] && feature['Name*'] && feature['Type*'] && feature['Longitute 1*'] && feature['Latitude 1*']) {
		const toAdd = polygonIconPosition(feature);
		freeingSpacesJSON.push(convertToGeoJSON(toAdd));
	}
});

const basic = {
	osm: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
	attr: ''
};
const watercolor = {
	osm: 'http://c.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg',
	attr: 'Imagery © <a href="http://maps.stamen.com/#watercolor">Stamen Design</a> (CC BY 3.0)'
};
const terrain = {
	osm: 'http://c.tile.stamen.com/terrain/{z}/{x}/{y}.jpg',
	attr: 'Imagery © <a href="http://maps.stamen.com/#terrain">Stamen Design</a> (CC BY 3.0)'
};
const terrainBg = {
	osm: 'http://c.tile.stamen.com/terrain-background/{z}/{x}/{y}.jpg',
	attr: 'Imagery © <a href="http://maps.stamen.com/#terrain-background">Stamen Design</a> (CC BY 3.0)'
};
const topo = {
	osm: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
	attr: 'Imagery © <a href="http://opentopomap.org">opentopomap.org</a> (CC-BY-SA)'
};
const bw = {
	osm: 'https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png',
	attr: 'Imagery © <a href="https://ge-map-overlays.appspot.com/openstreetmap/mapnik">mapnik</a>'
};

const freeColor = 'red';

const mapData = bw;

const map = L.map('map').setView([0, 0], 2);

L.tileLayer(mapData.osm, {
	maxZoom: 18,
	minZoom: 2,
	continuousWorld: false,
	attribution: `Map data © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors ${mapData.attr}`,
	tileSize: 512,
	zoomOffset: -1
}).addTo(map);

L.control.scale().addTo(map);

function onEachFeature(feature, layer) {
	const props = feature.properties;
	let text = props.url ? `<a href=${props.url} target="_blank">${props.admin}</a>` : props.admin;
	if (props.description) {
		text += `<br/><em>${props.description}</em>`;
	}
	layer.bindPopup(text);
}

const housingIcon = L.icon({
	iconUrl: './images/housing.png',
	iconSize: [32, 37],
	iconAnchor: [16, 37],
	popupAnchor: [0, -28],
	color: freeColor
});

const landIcon = L.icon({
	iconUrl: './images/land.png',
	iconSize: [32, 37],
	iconAnchor: [16, 37],
	popupAnchor: [0, -28],
	color: freeColor
});

const projectIcon = L.icon({
	iconUrl: './images/projects.png',
	iconSize: [32, 37],
	iconAnchor: [16, 37],
	popupAnchor: [0, -28],
	color: freeColor
});

L.geoJSON(freeingSpacesJSON, {
	style: function (feature) {
		return {'color': feature.properties.freed ? freeColor : '#bf965b'};
	},
	onEachFeature: onEachFeature,
	markersInheritOptions: true,
	pointToLayer: function (feature, latlng) {
		console.log({feature})
		if (feature.properties.type === 'Housing') {
			return L.marker(latlng, {icon: housingIcon});
		} else if (feature.properties.type === 'Land / Food') {
			return L.marker(latlng, {icon: landIcon});
		} else if (feature.properties.type === 'Projects') {
			return L.marker(latlng, {icon: projectIcon});
		} else {
			return L.circleMarker(latlng, {
				radius: 6,
				fillColor: freeColor,
				weight: 1,
				opacity: 1,
				opacity: 1,
			});
		}
	}
}).addTo(map);