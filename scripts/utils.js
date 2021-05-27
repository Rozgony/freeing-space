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

function onEachFeature(feature, layer) {
	const props = feature.properties;
	let text = props.url ? `<a href=${props.url} target="_blank">${props.admin}</a>` : props.admin;
	if (props.description) {
		text += `<br/><em>${props.description}</em>`;
	}
	layer.bindPopup(text);
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

function toggleLand() {
	$('#map').toggleClass('no-land');
	$('#map .panel-list .panel-list-item:nth-of-type(1)').toggleClass('not-pressed');
}

function toggleHousing() {
	$('#map').toggleClass('no-housing');
	$('#map .panel-list .panel-list-item:nth-of-type(2)').toggleClass('not-pressed');
}

function toggleProjects() {
	$('#map').toggleClass('no-projects');
	$('#map .panel-list .panel-list-item:nth-of-type(3)').toggleClass('not-pressed');
}

function removeSearch(isClear) {
	if (searchLayer) {
		map.removeLayer(searchLayer);
	}
	if (isClear) {
		$('#searchboxinput').val('');
	}
}

function toggleModal() {
	$('.modal-container').toggleClass('modal-open');
}

function download(content,fileName, contentType){
   var a = document.createElement('a');
   var file = new Blob([content],{type:contentType});
   a.href = URL.createObjectURL(file);
   a.download = fileName;
   a.click();
}

// Used to modify a json, csv, etc into the proper format to add to the Google Sheet. Modify as needed.
function convertList(list){
   const newList = list.map( item => {
      return {
         Name: item.Name,
         Website: item.homepage,
         ['Latitude 1']: Number(item.gps.split(',')[1]),
         ['Longitude 1']: Number(item.gps.split(',')[0])
      }
   });

   download(JSON.stringify(newList),'newList.txt', 'text/txt');
}

// Uncomment to use and add the name of the list to convert.
// convertList(list);
