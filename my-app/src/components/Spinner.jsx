const spinnerPath = require('./../images/spinner.png').default;


function Spinner({toggleModalVisibility,animationclass}){
	return (
		<div className="backdrop" >
			<img className="page-spinner" alt="a compass as the spinner" src={spinnerPath}/>
		</div>
	);
}

export default Spinner;