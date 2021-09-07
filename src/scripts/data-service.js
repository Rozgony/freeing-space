import brazilCondensed from './../geoJSONs/brazilCondensed.js';
import landDataStr from './../geoJSONs/landData.js';
import freeingSpacesFromCSV from './../geoJSONs/freeingspace_data.js';

function createGeometry(space,createIcon) {
	const coordinates = [];
	for (const key in space) {
		if(key.includes('Latitude') && space[key]) {
			const lat = Number(space[key]);
			const long = Number(space[`Longitute ${key.split(' ')[1]}`]);
			coordinates.push([lat,long]);
		}
	}
	if (!coordinates.length) {
		return {};
	} else if (coordinates.length === 1 || createIcon) {
		return {
			type: 'Point',
			coordinates: coordinates[0]
		};
	} else {
		return {
			type: 'Polygon',
			coordinates: [coordinates]
		};
	}
}


function polygonIconPosition(feature){
	const toAdd = {
		'Name': feature['Name'],
		'Type': feature['Type'],
		'Website': feature['Website'],
		'Description': feature['Description']
	};
	const lats = [];
	const longs = [];
	let latsTotal = 0;
	let longsTotal = 0;
	for(const prop in feature) {
		if (prop.includes('Latitude') && feature[prop]) {
			lats.push(feature[prop])
			latsTotal += Number(feature[prop]);
		} else if (prop.includes('Longitute') && feature[prop]) {
			longs.push(feature[prop])
			longsTotal += Number(feature[prop]);
		}
	}
	toAdd['Latitude 1'] = latsTotal / lats.length;
	toAdd['Longitute 1'] = longsTotal / longs.length;
	return toAdd;
}


function convertToGeoJSON(space,createIcon){
	const geometry = createGeometry(space,createIcon);
	return 	{
				type: 'Feature',
				properties: {
					admin: space['Name'] || '',
					freed: true,
					url: space.Website || '',
					description: space.Description || '',
					type: space['Type'] || ''
				},
				geometry
			};
}


function createMultiPolygonGeometry(geom){
	const openIndex = geom.indexOf('(') + 1;
	const closeIndex = geom.lastIndexOf(')');
	const groups = geom.slice(openIndex,closeIndex);
	const coordinates = [];
	getNextChunk(groups);

	function getNextChunk(geoString){
		geoString = geoString.trim();
		const start = geoString.indexOf('(') + 2;
		const end = geoString.indexOf(')');
		const group = geoString.slice(start,end);
		if (!group.length) {
			return;
		}
		let coordsGroup = group.trim().split(',').map( coords => {
			const [lat,lon] = coords.trim().split(' ').map( value => {
				const num = Number(value.trim());
				return num > 10 ? (num * -1) : num; // correct for positives in dataset
			});
			return [lon,lat];
		});
		if (coordsGroup.length > 50) {
			// if there are more than 50 points, filter out every other one
			coordsGroup = coordsGroup.filter( (coords,i) => i % 2 !== 0 && i % 3 !== 0);
		} else if (coordsGroup.length > 25) {
			// if there are more than 25 points, filter out every other one
			coordsGroup = coordsGroup.filter( (coords,i) => i % 2 === 0);
		};

		coordinates.push(coordsGroup);
		const newGeoString = geoString.slice(end+3); // account for ")),"
		if (newGeoString.length) {
			getNextChunk(newGeoString);
		}
	}

	return  {
		type: 'MultiPolygon',
		coordinates: [coordinates]
	};
}

function convertBrazilIndigenousToGeoJSON(space){
	// const space = {
	//    "FID": "ti_sirgas.fid--1bcb9690_17af839dbee_-5fbd",
	//    "gid": 1,
	//    "terrai_codigo": 101,
	//    "terrai_nome": "Acapuri de Cima",
	//    "etnia_nome": "Kokama",
	//    "municipio_nome": "Fonte Boa",
	//    "uf_sigla": "AM",
	//    "superficie_perimetro_ha": 18393.9411,
	//    "fase_ti": "Declarada",
	//    "modalidade_ti": "Tradicionalmente ocupada",
	//    "reestudo_ti": "",
	//    "cr": "COORDENACAO REGIONAL DO ALTO SOLIMOES",
	//    "faixa_fronteira": "Não",
	//    "undadm_codigo": 30202001857,
	//    "undadm_nome": "COORDENACAO REGIONAL DO ALTO SOLIMOES",
	//    "undadm_sigla": "CR-AS",
	//    "the_geom": "MULTIPOLYGON (((-66.883591291858 -2.5375211068052, -66.87456584899 -2.5375632947577, -66.865585616319 -2.5375946676445, -66.856577563511 -2.5376471796339, -66.847615290895 -2.5376678254665, -66.838580717955 -2.5377703576827, -66.829672375554 -2.5377537723316, -66.820621992511 -2.5378540065443, -66.811660289863 -2.5379183195647, -66.802676857092 -2.537968039531, -66.793663484155 -2.5379939104063, -66.784667301307 -2.5380668204779, -66.775624678214 -2.5381163184675, -66.766706515701 -2.5381650754017, -66.761872462651 -2.5381915025341, -66.761750375688 -2.5469487015188, -66.761684659125 -2.5559888486969, -66.761498351992 -2.5650119578431, -66.761403395311 -2.5740419329719, -66.761284358552 -2.5831279833448, -66.761118411582 -2.5922125757224, -66.761046755058 -2.6012538038635, -66.760928858302 -2.6102394317751, -66.760810341575 -2.6192697958717, -66.760729973801 -2.6253893973613, -66.760617671389 -2.6273556703594, -66.761754223954 -2.6276165192021, -66.762629928591 -2.6278214713512, -66.762946672822 -2.6278401033648, -66.763375209134 -2.627914631419, -66.763822377459 -2.6279518954461, -66.764120489676 -2.6280636875275, -66.765201146462 -2.6284549598122, -66.766020955059 -2.6286412799478, -66.766412227343 -2.6287717040427, -66.766635811506 -2.6288462320969, -66.767008451777 -2.6289766561918, -66.767325196008 -2.6290884482732, -66.767660572252 -2.6291257123003, -66.768610804943 -2.6294983525714, -66.769915045892 -2.6299455208968, -66.771722351207 -2.6305976413713, -66.774219041024 -2.6315292420492, -66.77582139419 -2.632088202456, -66.777051107085 -2.6325167387678, -66.778038603803 -2.6329639070932, -66.780348973485 -2.6341563559609, -66.781504158325 -2.634864372476, -66.782752503234 -2.6356096530184, -66.783702735925 -2.6363921975878, -66.784541176535 -2.6371933741708, -66.784895184793 -2.6375287504148, -66.78493244882 -2.6376591745097, -66.785864049498 -2.6387025672689, -66.787242818501 -2.6405657686247, -66.788714747572 -2.6425780260889, -66.78938550006 -2.6434723627397, -66.790652476982 -2.6451678759734, -66.792031245985 -2.6469379172614, -66.792403886256 -2.6474223496139, -66.792925582636 -2.6483353182783, -66.793913079355 -2.6496768232544, -66.795161424263 -2.6510555922577, -66.796130288968 -2.6517449767593, -66.797993490324 -2.6529187936134, -66.798366130595 -2.6529933216677, -66.799204571205 -2.6534591220066, -66.800601972222 -2.6544279867116, -66.801924845184 -2.6555645395386, -66.803732150499 -2.6575395329758, -66.804868703327 -2.6587878778841, -66.806079784208 -2.6601480148738, -66.806545584547 -2.6606697112534, -66.80929679454 -2.6640183088489, -66.8112660064 -2.6663283458388, -66.813197348801 -2.6686005133698, -66.814825735532 -2.6712513754893, -66.816189036051 -2.6737128903145, -66.81819611737 -2.676628838646, -66.81820114183 -2.6766344606018, -66.82880370782 -2.6680531813473, -66.831984742363 -2.66434197438, -66.83637759959 -2.6607822452481, -66.841527845993 -2.6578284274578, -66.845011836208 -2.6562379101861, -66.848192870751 -2.6550260875029, -66.853040161484 -2.6525267032188, -66.859553708406 -2.6504060135232, -66.865612821822 -2.6492699297577, -66.870838807143 -2.6494214075931, -66.876594964888 -2.6500273189347, -66.881215038868 -2.651466358371, -66.886367933204 -2.6535124267497, -66.886957045047 -2.6516180011431, -66.888051564773 -2.6502420334884, -66.889020996529 -2.6488035218494, -66.889271172467 -2.6473024662262, -66.889740252349 -2.6456763226343, -66.890647140121 -2.6448945228305, -66.891241307972 -2.6450196107991, -66.891491483909 -2.6446443468933, -66.891929291799 -2.642924387325, -66.892773635587 -2.6423927634584, -66.894368507187 -2.6395782841648, -66.895838290818 -2.6373892447142, -66.896432458669 -2.6359820050674, -66.898121146245 -2.6332613417502, -66.899747289837 -2.6303843184723, -66.900560361633 -2.6286643589039, -66.901217073468 -2.6271945752728, -66.901467249406 -2.625787335626, -66.901373433429 -2.6254746157045, -66.901373433429 -2.6245989999243, -66.901748697335 -2.6234106642225, -66.902530497139 -2.6215968886777, -66.903437384911 -2.6199707450858, -66.903812648817 -2.6184071454783, -66.903750104833 -2.6170311778236, -66.903062121005 -2.6140290665771, -66.902280321201 -2.6123716509931, -66.902061417256 -2.6110269553305, -66.901123257492 -2.6086190119349, -66.900435273665 -2.6072430442802, -66.898977807581 -2.6034372600502, -66.897834118567 -2.6008376396317, -66.896126863359 -2.597977722251, -66.894319674372 -2.5954555304351, -66.892564058741 -2.5934717807225, -66.889884927718 -2.5909556654592, -66.886619655483 -2.5882649855897, -66.881139849937 -2.5848462788015, -66.881449578897 -2.5788687579206, -66.881964887549 -2.5698077716633, -66.882409515878 -2.5607443354177, -66.882900784483 -2.5517806465746, -66.883358012904 -2.5427337293794, -66.883591291858 -2.5375211068052)))",
	//    "dominio_uniao": "f"
	//  };

	const geometry = createMultiPolygonGeometry(space.the_geom);
	return {
			type: 'Feature',
			properties: {
				admin: space.terrai_nome || '',
				freed: true,
				url: '',
				description: `${space.etnia_nome}: ${space.modalidade_ti}`,
				type: 'Land / Food'
			},
			geometry
		};
}

function convertBrazilIndigenousToGeoStr(space){
	const geometry = JSON.stringify(createMultiPolygonGeometry(space.the_geom));
	return {
			type: 'Feature',
			properties: {
				admin: space.terrai_nome || '',
				freed: true,
				url: '',
				description: `${space.etnia_nome}: ${space.modalidade_ti}`,
				type: 'Land / Food'
			},
			geometry
		};
}

function convertBrazilIndigenousToGeoJSONPoint(space){
	const startIndex = space.the_geom.indexOf('(') + 3;
	const endIndex = space.the_geom.indexOf(',');
	const coordinates = space.the_geom.slice(startIndex,endIndex).split(' ').map( val => Number(val));

	const geometry = {
		type: 'Point',
		coordinates: [coordinates[1],coordinates[0]]
	};
	return {
			type: 'Feature',
			properties: {
				admin: space.terrai_nome || '',
				freed: true,
				url: '',
				description: `${space.etnia_nome}: ${space.modalidade_ti}`,
				type: 'Land / Food'
			},
			geometry
		};
}

function convertSquatToGeoJSON(squat) {
	const lon = Number(squat.map.lon);
	const lat = Number(squat.map.lat);

	const geometry = {
		type: 'Point',
		coordinates: [
			lat,
			lon
		]
	};

	return {
				type: 'Feature',
				properties: {
					admin: squat.title || '',
					freed: true,
					url: '',
					description: '',
					type: 'Housing'
				},
				geometry
			};
}


function getStaticData(){
	const polygonData = brazilCondensed;
	const landData = JSON.parse(landDataStr);
	const projectsData = [];
	const housingData = [];
	polygonData.forEach(space => {
		space.geometry = JSON.parse(space.geometry);
	});

	freeingSpacesFromCSV.forEach(space => {
		if (space['Name'] && space['Type'] && space['Longitute 1'] && space['Latitude 1']) {
			const spaceGeoJSON = convertToGeoJSON(space);

			if (space['Type'] === 'Housing') {
				housingData.push(spaceGeoJSON);
			} else if (space['Type'] === 'Land / Food') {
				landData.push(spaceGeoJSON);
			} else if (space['Type'] === 'Projects') {
				projectsData.push(spaceGeoJSON);
			}
			
			if(space['Latitude 2'] && space['Longitute 2']) {
				polygonData.push(spaceGeoJSON);
				const createIcon = true;
				const iconGeoJSON = convertToGeoJSON(space,createIcon);
				landData.push(iconGeoJSON);
			}
		}
	});
	return { polygonData, landData, projectsData, housingData };
}



function getSquats(){
	// https://radar.squat.net/api/1.2/search/location.json?fields=title,map,squat
		// map	
		// 	geom	"POINT (5.1219355116631 52.09504796098)"
		// 	geo_type	"point"
		// 	lat	"52.095047960980"
		// 	lon	"5.121935511663"
		// 	left	"5.121935511663"
		// 	top	"52.095047960980"
		// 	right	"5.121935511663"
		// 	bottom	"52.095047960980"
		// 	srid	null
		// 	latlon	"52.095047960980,5.121935511663"
		// 	schemaorg_shape	""
		// squat	"former"
		// type	"location"
		// title	"ACU Voorstraat 71  Utrecht Netherlands"
	return new Promise((resolve,reject) =>{
		fetch("https://radar.squat.net/api/1.2/search/location.json?fields=title,map,squat",{
			method: 'GET'
		})
		.then( response => response.json())
		.then( data => {
	  		const geo = [];
	  		for (const item in data.result) {
	  			const squat = data.result[item];
	  			if (squat.map && squat.map.geom && squat.map.lat && squat.map.lon){
	  				geo.push(convertSquatToGeoJSON(squat));
	  			}
	  		}
	  		resolve(geo);
		})
		.catch(error => {
	    	// fail silently
	    	resolve(error);
	  	});
	});
}


function download(content,fileName, contentType = 'application/json'){
   var a = document.createElement('a');
   var file = new Blob([content],{type:contentType});
   a.href = URL.createObjectURL(file);
   a.download = fileName;
   a.click();
}


export {
	convertBrazilIndigenousToGeoJSON,
	convertBrazilIndigenousToGeoJSONPoint,
	convertBrazilIndigenousToGeoStr,
	convertToGeoJSON,
	polygonIconPosition,
	download,
	getStaticData,
	getSquats
}
