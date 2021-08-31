import { Popup } from 'react-leaflet';


function CustomPopup({properties}){
	return(
		<Popup>
			{ properties?.url ? 
				<a href={properties?.url} >{properties?.admin}</a> :
				properties?.admin
			}<br/>
			<em>{properties?.description}</em>
		</Popup>
	);
}

export default CustomPopup;