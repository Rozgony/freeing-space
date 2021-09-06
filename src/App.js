import { MapContainer } from 'react-leaflet';
import './App.scss';
import Map from './components/Map';
const namePath = require('./images/Parchment-transparent-1.png').default;
// const namePath = require('./images/Logo-parchment.png').default;

function App() {
	return (
	<div className="App">
		<header className="page-name">
			<img alt="Freeing Space" src={namePath}/>
		</header>
		<MapContainer center={[0,0]} zoom={2} scrollWheelZoom={true} zoomControl={false} >
			<Map/>
		</MapContainer>
	</div>
	);
}

export default App;
