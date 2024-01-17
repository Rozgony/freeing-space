import { useMapEvents } from 'react-leaflet';
import L from 'leaflet';

function MapListener({toggleSpinner}) { 
	const map = useMapEvents({    
		zoom: (zoom) => {    
			const zoomLevel = map.getZoom();
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
		locationfound: (e) => {
			map.flyTo(e.latlng, map.getZoom());
			const radius = e.accuracy;
			const circle = L.circle(e.latlng, {
				radius,
				weight: 8,
				opacity: 0.9
			});
			circle.addTo(map);
			toggleSpinner(false);
		},
		locationerror: (e) => {
			toggleSpinner(true,'Issue Finding Current Location');
			setTimeout(()=>{
				toggleSpinner(false);
			},500);
		}
	})  
	return null
}

export default MapListener;