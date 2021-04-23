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

function convertToGeoJSON(space){
	const geometry = createGeometry(space);
	return 	{
				type: 'Feature',
				properties: {
					admin: space.Name,
					freed: true,
					url: space.Website,
					description: space.Description,
				},
				geometry
			};
}