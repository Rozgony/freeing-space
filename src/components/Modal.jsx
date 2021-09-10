const borderImageSrc = require('../images/About-page.png').default;

function Modal({toggleModalVisibility,totalSpaces}){
	const borderStyle = {
		borderImage: `url('${borderImageSrc}') 260 300 200 360 / auto stretch`
	};
	return(
		<div className="backdrop is-dark" >
			<div className="modal-border" style={borderStyle}>
				<div className="modal-content">
					<button className="close-modal" onClick={toggleModalVisibility}> X </button>
					<header><em>About</em></header>
					<p>
						There are, always have been, and always will be spaces outside of Capitalism. Many of us have been taught to believe there are no alternatives and 
						there never have been options for a civilization beyond a small handful of forms of domination (slavery, feudalism, authoritarian state socialism, 
						capitalism, etc). This is false both historically and in the present day. Despite the current Neoliberal form of Capitalism that attempts to 
						colonize every corner of our physical and mental universe in the pursuit of profit, there are a number of spaces outside of its reach, whether newly 
						liberated or older than capitalism itself. We are here to document those spaces.
					</p>
					<span> The spaces on this map are:</span>
					<ul>
					    <li>Not profit-driven</li>
					    <li>Non-state</li>
					    <li>Democratically operated</li>
					    <li>Non-exclusive on grounds of identity</li>
					</ul>
					
					<p>Our hope is that collecting these {totalSpaces || null} heterogeneous efforts on a single map aids the construction of worlds outside of state and capital. <a href="mailto:freeingspace@riseup.net.">Contact us for more info.</a></p>
				</div>
			</div>
		</div>
	);
}

export default Modal;