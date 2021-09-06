import { useMap } from 'react-leaflet';
const iconPath = require('./../images/my_location.png').default;


function ZoomTo(){
	const map = useMap();

	function locateMe(){
		map.locate({setView: true, maxZoom: 16, enableHighAccuracy: true});
	}
	return(
		<button className="locate-me" onClick={locateMe}><img alt="a locate icon" src={iconPath}/></button>
	);
}

export default ZoomTo;