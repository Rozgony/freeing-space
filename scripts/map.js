// const freeingSpacesJSON = freeingSpaces;
const freeingSpacesJSON = freeingSpacesFromCSV.map(convertToGeoJSON);

const mapData = globe.features.concat(freeingSpacesJSON);
const mapContainer = d3.select('#map');

const mapRatio = 0.4;

// The plus turns it into a number
const headerHeight = 64;
const width = window.innerWidth;
const height = window.innerHeight - headerHeight;
const minMag = 1;
const maxMag = 40;
const strokeWidth = '0.5px';
const strokeWidthEm = '1px';

// Projection
// const projection = d3.geoNaturalEarth1() // another projection option
const projection = d3.geoEqualEarth()
.scale(width / (2 * Math.PI))
.translate([width / 2, height / 2]); // Centered initially ([longitude, latitude])

const pathBuilder = d3.geoPath(projection)
					.pointRadius(2);

// The Tooltip
const Tooltip = d3.select('body')
				.append('div')
				.attr('class', 'map-tooltip')
				.style('visibility', 'hidden')
				.style('background-color', 'white')
				.style('border', 'solid')
				.style('border-width', '2px')
				.style('border-radius', '5px')
				.style('padding', '5px')
				.style('position', 'absolute')
				.on('mouseover', (event) => {
					// A bug where if the user's cursor gets on top of the Tooltip, it flashes infinitely until the user's cursor moves
					// Very distracting and this gets rid of it completely. Besides, the cursor should never be over the Tooltip anyway
					Tooltip.style('visibility', 'hidden');
				});

const zoom = d3.zoom()
			.on('zoom', (event) => {
				map.attr('transform', event.transform);
				map.selectAll('path').attr('stroke-width', `${event.transform.k/128}px`);
			})
			.scaleExtent([minMag, maxMag]);

// The Map
const map = mapContainer.append('svg')
			.attr('padding', 'none')
			.attr('height', width * 0.48688353)
			.attr('width', width)
			// .attr('border', '1px solid black')
			.attr('margin-left', '16px')
			.attr('preserveAspectRatio', 'xMinYMin meet')
			.call(zoom) // This is for when you zoom on the background, it will zoom
			.append('g'); // This is going to be the country group


map.selectAll('path')
.data(mapData)
.enter() // This will be the countries appended
.append('path') // Used for clearing out styling later
.classed('country', true) // Used for selecting specific countries for styling
.attr('id', (feature) => {
	return `country${createID(feature.properties)}`; // Simple stylings
})
.attr('opacity', '.7')
.attr('stroke', '#333')
.attr('stroke-width', '0px')
.attr('d', (feature) => {
	return pathBuilder(feature); // Using the projection, create the polygon for the country
})
.attr('fill', d => {
	return d.properties.freed ? 'red' : 'white';
})
.style('cursor', d => {
	return d.properties.website ? 'pointer' : 'default';
})
// Events are given the event object and the feature object (AKA datum AKA d as it is usually shown in documentation)
.on('mouseover', (event, feature) => {
	// This adds the styling to show the user they are hovering over the country
	d3.select(`#country${createID(feature.properties)}`)
		.transition()
		.duration(200)
		.attr('opacity', '1')
		// .attr('stroke-width', strokeWidthEm);
		// Show the Tooltip
		Tooltip.style('visibility', 'visible');
})
.on('mouseleave', (event, feature) => {
	// This clears out the remaining styles on all other countries not currently being hovered
	d3.selectAll('.country')
		.transition()
		.duration(200)
		.attr('opacity', '0.7')
		// .attr('stroke-width', strokeWidth);
		// Hide the tooltip
		Tooltip.style('visibility', 'hidden');
})
.on('mousemove', (event, feature) => {
	// This adds the tooltip where the user's cursor currently is
	let text = feature.properties.admin;
	if (feature.properties.description) {
		text += `<br/><em>${feature.properties.description}</em>`;
	}
	Tooltip.html(text)
		.style('left', (event.x + 10) + 'px')
		.style('top', (event.y + 10) + 'px');
})
.on('click', (event, feature) => {
	if (feature.properties.website) {
		window.open(feature.properties.website,'_blank');
	}
});
