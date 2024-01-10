
function download(content,fileName, contentType = 'application/json'){
    var a = document.createElement('a');
    var file = new Blob([content],{type:contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
 }

 
function removeEmptyProps(){
	const smallerDataset = freeingSpacesFromCSV.map( space => {
		for (let prop in space) {
			if(!space[prop]) {
				delete space[prop];
			}
		}
		return space;
	});

	download(JSON.stringify(smallerDataset),'freeingspace_data.js');
}