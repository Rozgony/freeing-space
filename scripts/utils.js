function createID(props) {
	let name = props.adm0_a3 || props.admin;
	return name.replace(/[&<>,`=#$*()^@!+~?%;\[\]\\\/."']/g,'').replace(/ /g,'');
}

function createGeometry(space) {
	const coordinates = [];
	for (const key in space) {
		if(key.includes('Latitude') && space[key]) {
			const lat = Number(space[key]);
			const long = Number(space[`Longitute ${key.split(' ')[1]}`]);
			coordinates.push([long,lat]);
		}
	}
	if (!coordinates.length) {
		return {};
	} else if (coordinates.length === 1) {
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
		if (prop.includes('Latitude')) {
			lats.push(feature[prop])
			latsTotal += Number(feature[prop]);
		} else if (prop.includes('Longitute')) {
			longs.push(feature[prop])
			longsTotal += Number(feature[prop]);
		}
	}
	toAdd['Latitude 1'] = latsTotal / lats.length;
	toAdd['Longitute 1'] = longsTotal / longs.length;
	return toAdd;
}

function convertToGeoJSON(space){
	const geometry = createGeometry(space);
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