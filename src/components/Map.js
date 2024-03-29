import { useState, useEffect, useRef } from 'react';
import { TileLayer, ImageOverlay, ZoomControl, useMap } from 'react-leaflet';
import L from 'leaflet';
import MapListener from './MapListener.jsx';
import SearchBox from './SearchBox.jsx';
import Modal from './Modal.jsx';
import ZoomTo from './ZoomTo.jsx';
import Spinner from './Spinner.jsx';
import { getStaticData, getSquats, parseGoogleSheetsAPIData } from './../scripts/data-service.js';
import { housingIcon, landIcon, projectsIcon, createMarkerLayer, createPolygonsLayer } from './../scripts/ui-service.js';
import '../../node_modules/leaflet/dist/leaflet.css';
import './../App.scss';
const chimera1Path = require('./../images/Chimera-1.png').default;
const chimera2Path = require('./../images/chimera-02.png').default;
const monsterPath = require('./../images/monster-3.png').default;
const namePath = require('./../images/Parchment-transparent-1.png').default;
// const namePath = require('./images/Logo-parchment.png').default;
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
	const [totalSpaces, setTotalSpaces] = useState(0);
	const [spinnerText, setSpinnerText] = useState('Loading Brazil Data...');
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
	const toggleSpinner = (value,text) => {
		// rendering generally takes time and so delay taking it down by 500ms
		const time = value ? 0 : 500;
		const textToShow = value === false ? '' : text;
		setTimeout(() =>{
			setShowSpinner(value);
			setSpinnerText(textToShow);
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
						toggleSpinner(true,'Navigating...');
						setTimeout(() =>{
							map.setView([latlng.lat,latlng.lng], zoom);
							toggleSpinner(false,'');
						});
					}
				}
				popupButton.current.addEventListener('click', jumpToLocation.current);
				popupButton.current.addEventListener('touch', jumpToLocation.current);
			}
		}
	});

	map.on('popupclose', function(){
		if (popupButton.current) {
			popupButton.current.removeEventListener('click', jumpToLocation.current);
			popupButton.current.removeEventListener('touch', jumpToLocation.current);
			popupButton.current = null;
		}
	});

	useEffect(() => {
		map.setMinZoom(2);
		setSpinnerText('Loading Freeing Space Data...');
		parseGoogleSheetsAPIData()
			.then( sheetsData => {
				housingData = housingData.concat(sheetsData.housingData);
				landData = landData.concat(sheetsData.landData);
				projectsData = projectsData.concat(sheetsData.projectsData);
				polygonData = polygonData.concat(sheetsData.polygonData);
				setSpinnerText('Loading Squat.net Data...');
				return getSquats();
			})
			.then( data =>{
				housingData = housingData.concat(data);
			})
			.catch( error => {
				console.log('Could not get squats data: ',error);
			})
			.finally(() =>{
				setSpinnerText('Building Map...');
				landRef.current = createMarkerLayer(map,landData,landIcon);
				projectsRef.current = createMarkerLayer(map,projectsData,projectsIcon);
				polygonRef.current = createPolygonsLayer(map,polygonData);
				housingRef.current = createMarkerLayer(map,housingData,housingIcon);	

				let totalSpacesCount = 0;
				if (typeof landRef.current?._layers === 'object') {
					totalSpacesCount += Object.keys(landRef.current?._layers).length;
				}
				if (typeof projectsRef.current?._layers === 'object') {
					totalSpacesCount += Object.keys(projectsRef.current?._layers).length;
				}
				if (typeof housingRef.current?._layers === 'object') {
					totalSpacesCount += Object.keys(housingRef.current?._layers).length;
				}
				setTotalSpaces(totalSpacesCount);

				setShowSpinner(false);
			});
		// eslint-disable-next-line
	},[]);

  	return (
  		<>
			{ 
				modalVisible || <header className="page-name">
									<img alt="Freeing Space" src={namePath}/>
								</header>
			}
			<TileLayer
		  		attribution='Data is open source. Please confirm website before visiting. Imagery © <a href=\"https://ge-map-overlays.appspot.com/openstreetmap/mapnik\">mapnik</a>'
		  		url="http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>
			<SearchBox 
				toggleModalVisibility={toggleModalVisibility} 
				toggleSpinner={toggleSpinner} 
				toggleHousingVisibility={toggleHousingVisibility}
				toggleLandVisibility={toggleLandVisibility}
				toggleProjectsVisibility={toggleProjectsVisibility}/>
			{ !modalVisible || <Modal toggleModalVisibility={toggleModalVisibility} totalSpaces={totalSpaces}/> }
			{ !showSpinner || <Spinner text={spinnerText}/> }
			<ZoomControl position="topright"/>
			<ZoomTo toggleSpinner={toggleSpinner}/>
			<MapListener toggleSpinner={toggleSpinner}/>   
			<ImageOverlay url={chimera1Path} bounds={chimera1Bounds} opacity={1} zIndex={1001}/>
			<ImageOverlay url={chimera2Path} bounds={chimera2Bounds} opacity={1} zIndex={1001}/>
			<ImageOverlay url={monsterPath} bounds={monsterBounds} opacity={1} zIndex={1001}/>
	  </>
  );
}

export default Map;