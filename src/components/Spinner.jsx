const spinnerPath = require('./../images/spinner.png').default;

function Spinner({text}){
	return (
		<div className="backdrop" >
			<img className="page-spinner" alt="a compass as the spinner" src={spinnerPath}/>
			<span className="page-spinner-text"> {text} </span>
		</div>
	);
}

export default Spinner;