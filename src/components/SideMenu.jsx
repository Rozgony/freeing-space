import { useState } from 'react';
// import { addSheetRow } from '../scripts/data-service';
const addYourOwnIcon = require('./../images/add-your-own.jpg').default;
const aboutIcon = require('./../images/about.jpg').default;
const projectsIcon = require('./../images/Mutual-aid.jpg').default;
const housingIcon = require('./../images/Housing.jpg').default;
const landIcon = require('./../images/Land.jpg').default;


function SideMenu({toggleModalVisibility,animationclass,toggleHousingVisibility,toggleLandVisibility,toggleProjectsVisibility}){
	function suggestSpace(){
		const url = `https://docs.google.com/spreadsheets/d/11F-WLs4tI3b6HezGhsXOo4FaYitRZ5UbmH8wDz2oUMs/edit#gid=0`;
		window.open(url,'_blank');
	}
	const [landSelected, setLandSelected] = useState(true);
	const landToggle = () => {
		toggleLandVisibility();
		setLandSelected(!landSelected);
	};

	const [housingSelected, setHousingSelected] = useState(true);
	const housingToggle = () => {
		toggleHousingVisibility();
		setHousingSelected(!housingSelected);
	};

	const [projectsSelected, setProjectsSelected] = useState(true);
	const projectsToggle = () => {
		toggleProjectsVisibility();
		setProjectsSelected(!projectsSelected);
	};

	return(
		<menu className={animationclass}>
			<header><em>Legend</em></header>
			<ul>
				<li className={landSelected ? 'selected' : ''}><button type="button" onClick={landToggle}><img alt="a chicken representing land" src={landIcon}/><span><b>Land:</b> Autonomus Communities, Agricultural Projects, Food Security, etc.</span></button></li>
				<li className={housingSelected ? 'selected' : ''}><button type="button" onClick={housingToggle}><img alt="a house representing housing" src={housingIcon}/><span><b>Housing:</b> Housing Co-ops, Residencies, etc.</span></button></li>
				<li className={projectsSelected ? 'selected' : ''}><button type="button" onClick={projectsToggle}><img alt="mutual aid representing projects" src={projectsIcon}/><span><b>Projects:</b> Co-op bookstores, Project Spaces, etc.</span></button></li>
				<li className="selected"><button type="button" onClick={toggleModalVisibility}><img alt="a compass representing about" src={aboutIcon}/><span><b>About</b></span></button></li>
				<li className="selected"><button type="button" onClick={suggestSpace}><img alt="someone writing for suggest a space" src={addYourOwnIcon}/><span><b>Suggest a Space</b></span></button></li>
			</ul>
		</menu>
	);
}

export default SideMenu;