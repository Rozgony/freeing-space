import L from 'leaflet';
const housingPath = require('./../images/Housing-transparent.png').default;
const landPath = require('./../images/Land-transparent.png').default;
const projectsPath = require('./../images/Mutual-aid.png').default;

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

export {
     housingIcon,
     landIcon,
     projectsIcon
}