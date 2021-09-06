import { useMapEvents } from 'react-leaflet';

function MapListener({icons}) { 
	const map = useMapEvents({    
		// click: click => {
		// 	console.log(click.latlng);
		// },
		zoom: (zoom) => {    
			const zoomLevel = map.getZoom();
			// console.log('zoom: '+zoomLevel);
			if (zoomLevel >= 10) {
				if (!map._container.classList.contains('js-large-icons')) {
					map._container.classList.add('js-large-icons');
				}
				if (map._container.classList.contains('js-medium-icons')) {
					map._container.classList.remove('js-medium-icons');
				}
			} else if (zoomLevel >= 5) {
				if (!map._container.classList.contains('js-medium-icons')) {
					map._container.classList.add('js-medium-icons');
				} 
				if (map._container.classList.contains('js-large-icons')) {
					map._container.classList.remove('js-large-icons');
				}
			} else {
				if (map._container.classList.contains('js-large-icons')) {
					map._container.classList.remove('js-large-icons');
				}
				if (map._container.classList.contains('js-medium-icons')) {
					map._container.classList.remove('js-medium-icons');
				}
			}
		},  
	})  
	return null
}

export default MapListener;