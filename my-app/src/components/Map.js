import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polygon, ImageOverlay, ZoomControl, LayerGroup } from 'react-leaflet';
import L from 'leaflet';
import MapListener from './MapListener.jsx';
import CustomPopup from './CustomPopup.jsx';
import SearchBox from './SearchBox.jsx';
import Modal from './Modal.jsx';
import ZoomTo from './ZoomTo.jsx';
import Spinner from './Spinner.jsx';
import { getStaticData, getSquats } from './../scripts/data-service.js';
import { housingIcon, landIcon, projectsIcon } from './../scripts/ui-service.js';
import '../../node_modules/leaflet/dist/leaflet.css';
import './../App.scss';
const chimera1Path = require('./../images/Chimera-1.png').default;
const chimera2Path = require('./../images/chimera-02.png').default;
const monsterPath = require('./../images/monster-3.png').default;
const freeColor = { color: '#474747' };
let { polygonData, landData, projectsData, housingData } = getStaticData();

const chimera1Bounds = new L.LatLngBounds([-31.05293398570515, -27.070312500000004], [-48.2246726495652, 10.546875000000002]);
const chimera2Bounds = new L.LatLngBounds([47.754097979680026, -174.72656250000003], [29.53522956294847, -143.08593750000003]);
const monsterBounds = new L.LatLngBounds([-4.565473550710278, 82.61718750000001], [-33.43144133557529, 107.57812500000001]);

function Map() {
	const [modalVisible, setModalVisibility] = useState(false);

	const [dataLoaded, setDataLoaded] = useState(false);
	const toggleModalVisibility = () => setModalVisibility(!modalVisible);
	
	const [housingVisible, setHousingVisible] = useState(true);
	const toggleHousingVisibility = () => {
		setHousingVisible(!housingVisible);
	};

	const [landVisible, setLandVisible] = useState(true);
	const toggleLandVisibility = () => {
		setLandVisible(!landVisible);
	};
	
	const [projectsVisible, setProjectsVisible] = useState(true);
	const toggleProjectsVisibility = () => {
		setProjectsVisible(!projectsVisible);
	};

	const [showSpinner, setShowSpinner] = useState(true);
	const toggleSpinner = (value) => {
		// rendering generally takes time and so delay taking it down by 500ms
		const time = value ? 0 : 500;
		setTimeout(() =>{
			setShowSpinner(value);
		},time);
	};

	useEffect(() => {
		getSquats()
			.then( data =>{
				housingData = housingData.concat(data);
			})
			.catch( error => {
				console.log('Could not get squats data: ',error);
			})
			.finally(() =>{
				setDataLoaded(true);
			});
	},[]);
  	return (
	  	<MapContainer center={[0,0]} zoom={2} scrollWheelZoom={true} zoomControl={false} whenReady={() => setShowSpinner(false)}>
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
			<ImageOverlay  url={chimera1Path}  bounds={chimera1Bounds}  opacity={1}  zIndex={1001}/>
			<ImageOverlay  url={chimera2Path}  bounds={chimera2Bounds}  opacity={1}  zIndex={1001}/>
			<ImageOverlay  url={monsterPath}  bounds={monsterBounds}  opacity={1}  zIndex={1001}/>
			{
		  		!dataLoaded || <LayerGroup >
		  						<LayerGroup >
			  						{
			  							polygonData.map((space,i) => {
											const multiPolygon = space?.geometry?.coordinates;
											return multiPolygon ? <Polygon key={`polygon${i}`} pathOptions={freeColor} icon={housingIcon} positions={multiPolygon} >
																	<CustomPopup space={space}/>
																</Polygon> : null;
								  		})
			  						}
			  					</LayerGroup>
								{
							  		!housingVisible || <LayerGroup >
												  		{
												  			housingData.map((space,i) => {
																const point = space?.geometry?.coordinates;
																const isValid = !!point && !isNaN(point[1]);
																const icon = housingIcon;
																return isValid ? <Marker key={`marker${i}`} position={point} icon={icon}>
																	        		<CustomPopup space={space}/>
																	    		</Marker> : null;
													  		})
												  		}
											  		</LayerGroup>
								}
								{
									!projectsVisible || <LayerGroup >
									  					{
									  						projectsData.map((space,i) => {
																const point = space?.geometry?.coordinates;
																const isValid = !!point && !isNaN(point[1]);
																const icon = projectsIcon;
																return isValid ? <Marker key={`marker${i}`} position={point} icon={icon}>
																	        		<CustomPopup space={space}/>
																	    		</Marker> : null;
													  		})
									  					}
												  	</LayerGroup>
								}
								{
							  		!landVisible || <LayerGroup >
											  		{
												  		landData.map((space,i) => {
															const point = space?.geometry?.coordinates;
															const isValid = !!point && !isNaN(point[1]);
															const icon = landIcon;
															return isValid ? <Marker key={`marker${i}`} position={point} icon={icon}>
																        		<CustomPopup space={space}/>
																    		</Marker> : null;
												  		})
												  	}
												</LayerGroup>
								}
							</LayerGroup>
			}
	  </MapContainer>
  );
}

export default Map;