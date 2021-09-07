import { MapContainer } from 'react-leaflet';
import './App.scss';
import Map from './components/Map';

function App() {
	return (
	<div className="App">
		<MapContainer center={[0,0]} zoom={2} scrollWheelZoom={true} zoomControl={false} >
			<Map/>
		</MapContainer>
	</div>
	);
}

export default App;
