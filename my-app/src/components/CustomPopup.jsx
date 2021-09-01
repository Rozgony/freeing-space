import { Popup, useMap } from 'react-leaflet';
const iconPath = require('./../images/my_location.png').default;


function CustomPopup({space}){
	const { properties } = space;
	const map = useMap();
	const jumpToLocation = () => {
		const zoom = 16;
		map.setView(space.geometry.coordinates, zoom);
	};
	return(
		<Popup>
			{ properties?.url ? 
				<a href={properties?.url} >{properties?.admin}</a> :
				properties?.admin
			}
			<button className="popup-button" onClick={jumpToLocation}><img alt="a locate icon" src={iconPath}/></button>
			<br/>
			<em>{properties?.description}</em>
		</Popup>
	);
}

export default CustomPopup;