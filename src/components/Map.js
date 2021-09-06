import { useState, useEffect, useRef } from 'react';
import { TileLayer, ImageOverlay, ZoomControl, useMap } from 'react-leaflet';
import L from 'leaflet';
import MapListener from './MapListener.jsx';
import SearchBox from './SearchBox.jsx';
import Modal from './Modal.jsx';
import ZoomTo from './ZoomTo.jsx';
import Spinner from './Spinner.jsx';
import { getStaticData, getSquats } from './../scripts/data-service.js';
import { housingIcon, landIcon, projectsIcon, createMarkerLayer, createPolygonsLayer } from './../scripts/ui-service.js';
import '../../node_modules/leaflet/dist/leaflet.css';
import './../App.scss';
const chimera1Path = require('./../images/Chimera-1.png').default;
const chimera2Path = require('./../images/chimera-02.png').default;
const monsterPath = require('./../images/monster-3.png').default;
let { polygonData, landData, projectsData, housingData } = getStaticData();

const chimera1Bounds = new L.LatLngBounds([-31.05293398570515, -27.070312500000004], [-48.2246726495652, 10.546875000000002]);
const chimera2Bounds = new L.LatLngBounds([47.754097979680026, -174.72656250000003], [29.53522956294847, -143.08593750000003]);
const monsterBounds = new L.LatLngBounds([-4.565473550710278, 82.61718750000001], [-33.43144133557529, 107.57812500000001]);

function Map() {
	const map = useMap();
	const landRef = useRef();
	const projectsRef = useRef();
	const housingRef = useRef();
	const polygonRef = useRef();

	const [modalVisible, setModalVisibility] = useState(false);
	const toggleModalVisibility = () => setModalVisibility(!modalVisible);
	
	const [housingVisible, setHousingVisible] = useState(true);
	const toggleHousingVisibility = () => {
		if(housingVisible){
			housingRef.current.remove();
		} else {
			housingRef.current.addTo(map);
		}
		setHousingVisible(!housingVisible);
	};

	const [landVisible, setLandVisible] = useState(true);
	function toggleLandVisibility(){
		if(landVisible){
			landRef.current.remove();
		} else {
			landRef.current.addTo(map);
		}
		setLandVisible(!landVisible);
	}

	const [projectsVisible, setProjectsVisible] = useState(true);
	const toggleProjectsVisibility = () => {
		if(projectsVisible){
			projectsRef.current.remove();
		} else {
			projectsRef.current.addTo(map);
		}
		setProjectsVisible(!projectsVisible);
	}

	const [showSpinner, setShowSpinner] = useState(true);
	const toggleSpinner = (value) => {
		// rendering generally takes time and so delay taking it down by 500ms
		const time = value ? 0 : 500;
		setTimeout(() =>{
			setShowSpinner(value);
		},time);
	};

	let jumpToLocation = useRef();
	let popupButton = useRef();
	map.on('popupopen', function(event){
		if (!popupButton.current){
			popupButton.current = document.querySelector('.popup-button');
			if (popupButton.current) {
				jumpToLocation.current = () => {
					const zoom = 16;
					const latlng = event?.popup?._latlng;
					if (latlng) {
						map.setView([latlng.lat,latlng.lng], zoom);
					}
				}
				popupButton.current.addEventListener('click', jumpToLocation.current);
			}
		}
	});

	map.on('popupclose', function(){
		if (popupButton.current) {
			popupButton.current.removeEventListener('click', jumpToLocation.current);
			popupButton.current = null;
		}
	});

	useEffect(() => {
		map.setMinZoom(2);
		getSquats()
			.then( data =>{
				housingData = housingData.concat(data);
			})
			.catch( error => {
				console.log('Could not get squats data: ',error);
			})
			.finally(() =>{
				landRef.current = createMarkerLayer(map,landData,landIcon);
				projectsRef.current = createMarkerLayer(map,projectsData,projectsIcon);
				polygonRef.current = createPolygonsLayer(map,polygonData);
				housingRef.current = createMarkerLayer(map,housingData,housingIcon);			

				setShowSpinner(false);
			});
	},[]);

  	return (
  		<>
			<TileLayer
		  		attribution='Imagery © <a href=\"https://ge-map-overlays.appspot.com/openstreetmap/mapnik\">mapnik</a>'
		  		url="https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png"
			/>
			<SearchBox 
				toggleModalVisibility={toggleModalVisibility} 
				toggleSpinner={toggleSpinner} 
				toggleHousingVisibility={toggleHousingVisibility}
				toggleLandVisibility={toggleLandVisibility}
				toggleProjectsVisibility={toggleProjectsVisibility}/>
			{ !modalVisible || <Modal toggleModalVisibility={toggleModalVisibility}/> }
			{ !showSpinner || <Spinner/> }
			<ZoomControl position="topright"/>
			<ZoomTo />
			<MapListener/>   
			<ImageOverlay url={chimera1Path} bounds={chimera1Bounds} opacity={1} zIndex={1001}/>
			<ImageOverlay url={chimera2Path} bounds={chimera2Bounds} opacity={1} zIndex={1001}/>
			<ImageOverlay url={monsterPath} bounds={monsterBounds} opacity={1} zIndex={1001}/>
	  </>
  );
}

export default Map;