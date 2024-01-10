import L from 'leaflet';
const housingPath = require('./../images/Housing-transparent.png').default;
const landPath = require('./../images/Land-transparent.png').default;
const projectsPath = require('./../images/Mutual-aid.png').default;
const locationIconPath = require('./../images/my_location.png').default;
const mapIconPath = require('./../images/map-icon.png').default;

// const basicOSM = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
// const watercolorOSM = 'http://c.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg';
// const topoOSM = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';

const iconSize = 8;
const housingIcon = new L.icon({
     iconUrl: housingPath,
     iconSize: new L.Point(iconSize,iconSize),
    className: 'leaflet-div-icon'
});

const landIcon = new L.icon({
     iconUrl: landPath,
     iconSize: new L.Point(iconSize,iconSize),
    className: 'leaflet-div-icon'
});

const projectsIcon = new L.icon({
     iconUrl: projectsPath,
     iconSize: new L.Point(iconSize,iconSize),
    	className: 'leaflet-div-icon projects-icon'
});

function createMarker(space,icon){
     const point = space?.geometry?.coordinates;
     const content = createPopupContent(space);
     const marker = L.marker(point, { icon });
     marker.bindPopup(content,{maxWidth: 250});
     return marker;
}

function createMarkerLayer(map,data,icon) {
     const markers = [];
     data.forEach(space => {
          if(space?.geometry?.coordinates && !Array.isArray(space?.geometry?.coordinates[0])){
               markers.push(createMarker(space,icon));
          }
     });
     return L.layerGroup(markers).addTo(map);
}

function createPopupContent(space,isPolygon){
     const properties = space?.properties;
     if (!properties) {
          return ''
     }
     const title = properties?.url ? `<a target="_blank" href="${properties?.url}">${properties?.admin}</a>` : properties?.admin;
     const [lat,lon] = space?.geometry?.coordinates;
     let lastConfirmed = '';
     if (properties.lastConfirmed) {
          const dateString = new Date(properties.lastConfirmed).toUTCString();
          lastConfirmed = `<span>Last Confirmed: ${dateString.slice(0,dateString.indexOf(':') - 3)}</span><br/>`;
     }
     const maplink = `<a class="popup-button" target="_blank" href="https://www.google.com/maps/search/?api=1&query=${lat},${lon}"><img alt="a map icon" src="${mapIconPath}"/></a>`
     return `${title} <button class="popup-button"><img alt="a locate icon" src="${locationIconPath}"/></button>${maplink}<br/>${lastConfirmed}<em>${properties?.description}</em>`;
}

function createPolygon(space){
     const latlngs = space?.geometry?.coordinates;
     const content = createPopupContent(space);
     const polygon = L.polygon(latlngs, {color: '#010000'});
     polygon.bindPopup(content,{maxWidth: 250});
     return polygon;
}

function createPolygonsLayer(map,data) {
     const polygons = [];
     data.forEach(space => {
          if(space?.geometry?.coordinates && Array.isArray(space?.geometry?.coordinates[0])){
               polygons.push(createPolygon(space));
          }
     });
     return L.layerGroup(polygons).addTo(map);
}

export {
     housingIcon,
     landIcon,
     projectsIcon,
     createMarkerLayer,
     createPolygonsLayer
}