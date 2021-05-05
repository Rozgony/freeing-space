let freeingSpacesJSON = [];
console.log()
freeingSpacesFromCSV.forEach(space => {
	if (space['Name'] && space['Type'] && space['Longitute 1'] && space['Latitude 1']) {
		freeingSpacesJSON.push(convertToGeoJSON(space));
	}

	if (space['Latitude 2'] && space['Longitute 2'] && space['Name'] && space['Type'] && space['Longitute 1'] && space['Latitude 1']) {
		const toAdd = polygonIconPosition(space);
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

map.zoomControl.setPosition('topright');

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

map.on('zoomend', function() {
	const currentZoom = map.getZoom();
	$('#map').toggleClass('small-icons',currentZoom < 7);
	$('#map').toggleClass('medium-icons',currentZoom < 10 && currentZoom > 7);
});

const criteriaHTML = `<ul><b>Criteria:</b>
						<li>Non-profit</li>
						<li>Not exclude people on grounds of identity </li>
						<li>Not be managed by the state</li>
						<li>Democratically Run (and Owned as appropriate)</li>
					</ul>`;

const searchboxControl = createSearchboxControl();
const control = new searchboxControl({
    sidebarTitleText: 'Legend',
    sidebarMenuItems: {
        Items: [
            { type: "button", name: '<b>Land:</b> Autonomus Communities, Agricultural Projects, Food Security, etc.', icon: './images/land.png' },
            { type: "button", name: "<b>Housing:</b> Housing Co-ops, Residencies, etc.", icon: './images/housing.png' },
            { type: "button", name: "<b>Projects:</b> Co-op bookstores, Project Spaces, etc.", icon: './images/projects.png' },
            { type: "text", name: criteriaHTML },
            { type: "link", name: "Suggest a Space", href: 'https://docs.google.com/spreadsheets/d/11F-WLs4tI3b6HezGhsXOo4FaYitRZ5UbmH8wDz2oUMs/edit#gid=0', icon: './images/add.png' },
        ]
    }
});
let searchLayer;
control._searchfunctionCallBack = function (searchkeywords){
	$('.backdrop').show();
	const isClear = false;
	removeSearch(isClear);
	const url = `https://nominatim.openstreetmap.org/search.php?q=${searchkeywords}&polygon_geojson=1&format=json`;
	$.ajax({
  		method: "GET",
  		url
	})
  	.done(function( msg ) {
  		if (msg && msg.length && msg[0].geojson) {
	    	searchLayer = L.geoJson(msg[0].geojson).addTo(map);
			map.fitBounds(searchLayer.getBounds());
		}
		$('.backdrop').hide();
  	});
}

map.addControl(control);

$('#searchbox-clear').click(() => {
	const isClear = true;
	removeSearch(isClear);
});

$('.my-location').click(() => {
	map.locate({setView: true, maxZoom: 16, enableHighAccuracy: true});
});

function removeSearch(isClear) {
	if (searchLayer) {
		map.removeLayer(searchLayer);
	}
	if (isClear) {
		$('#searchboxinput').val('');
	}
}

$('#searchboxinput').on("keyup", function(event) {
  	// Number 13 is the "Enter" key on the keyboard
  	if (event.keyCode === 13) {
    	// Cancel the default action, if needed
    	event.preventDefault();
    	// Trigger the button element with a click
    	$("#searchbox-searchbutton").click();
  	}
}); 