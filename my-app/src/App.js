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
      <Map/>
    </div>
  );
}

export default App;
