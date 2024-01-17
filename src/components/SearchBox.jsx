import { useState, useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import SideMenu from './SideMenu.jsx';
const burgerIcon = require('./../images/burger_icon.png').default;
const searchIcon = require('./../images/search_icon.png').default;

function SearchBox({toggleModalVisibility,toggleSpinner,toggleHousingVisibility,toggleLandVisibility,toggleProjectsVisibility}){
	const map = useMap();
	const [menuVisible, setVisibility] = useState(false);
	const [aniclass, setAniclass] = useState('');
	const [location, setLocation] = useState('');
	const [searchLayer, setSearchLayer] = useState(null);

	const toggleMenu = () => {
		if (menuVisible) {
			setAniclass('slide-up');
			setTimeout(()=>{
				setVisibility(!menuVisible);
			},500);
		} else {
			setVisibility(!menuVisible);
			setAniclass('');
		}
	};


	const toggleModal = () => {
		toggleModalVisibility();
		toggleMenu();
	};

	const removeSearch = isClear => {
		if (searchLayer) {
			map.removeLayer(searchLayer);
		}
		if (isClear) {
			setLocation('');
		}
	}

	const searchLocation = () => {
		toggleSpinner(true,'Seaching for Space...');
		const isClear = false;
		removeSearch(isClear);
		setTimeout(()=>{
			const url = `https://nominatim.openstreetmap.org/search.php?q=${location}&polygon_geojson=1&format=json`;
			fetch(url, {
		  		method: "GET"
			})
			.then( response => response.json())
			.then( data => {
		  		if (data && data.length && data[0].geojson) {
			    	setSearchLayer(L.geoJson(data[0].geojson).addTo(map));
				}
			})
			.catch(error => {
				console.log('Could not get location: ',error);
		  	})
		  	.finally(() =>{
				toggleSpinner(false);
		  	});
		});
	};

	const searchSubmit = e => {
		e.preventDefault();
		searchLocation();
	}

	useEffect(() => {
		if (searchLayer) {
			toggleSpinner(true,'Seaching for Space...');
			setTimeout(()=>{
				map.fitBounds(searchLayer.getBounds());
				toggleSpinner(false);
			});
		}
		// eslint-disable-next-line
	},[searchLayer,map]);

	return(
		<div className="side-container">
			<div className="search-box">
				<button className="menu-button" onClick={toggleMenu} ><img alt="burger-icon" src={burgerIcon}/></button> 
				<form onSubmit={searchSubmit}>
					<input type="text" placeholder="Search for a Location" onChange={ e => setLocation(e.target.value)} value={location}/>
				</form>
				<button className="search-box-clear" onClick={() => removeSearch(true)}>X</button>
				<button className="search-box-icon" onClick={searchLocation}><img alt="magifying glass" src={searchIcon}/></button>
			</div>
			{ !menuVisible || <SideMenu 
								toggleModalVisibility={toggleModal} 
								animationclass={aniclass} 
								toggleHousingVisibility={toggleHousingVisibility}
								toggleLandVisibility={toggleLandVisibility}
								toggleProjectsVisibility={toggleProjectsVisibility}/> }
		</div>
	);
}

export default SearchBox;