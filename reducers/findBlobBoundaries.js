module.exports.type = FIND_BLOB_BOUNDARIES;

module.exports.apply = function(state, action){
	
	var blobBoundaries = findBlobBoundaries(state.get('image').bitmap.width, state.get('image').bitmap.height, state.get('blobMap'));

	return state
		.set('blobBoundaries', blobBoundaries);
};

function findBlobBoundaries(xSize, ySize, blobMap){
	//Find boundaries of each blob
	var boundaries = {};
	for(var y=0; y<ySize; y++){
		for(var x=0; x<xSize; x++){
		  var label = blobMap[y][x];
		  
		  var labelBoundaries = boundaries[label];

		  if(labelBoundaries){
		    //There's already boundaries, update them with current pixel
		    labelBoundaries.xmin = Math.min(labelBoundaries.xmin, x);
		    labelBoundaries.xmax = Math.max(labelBoundaries.xmax, x);
		    labelBoundaries.ymin = Math.min(labelBoundaries.ymin, y);
		    labelBoundaries.ymax = Math.max(labelBoundaries.ymax, y);
		  }
		  else{
		    //There's no boundaries for this label, simply add one with this pixel's coords
		    labelBoundaries = {};
		    labelBoundaries.xmin = x;
		    labelBoundaries.xmax = x;
		    labelBoundaries.ymin = y;
		    labelBoundaries.ymax = y;
		  }

		  labelBoundaries.width = labelBoundaries.xmax - labelBoundaries.xmin;      
		  labelBoundaries.height = labelBoundaries.ymax - labelBoundaries.ymin;
		  labelBoundaries.xcenter = labelBoundaries.xmin + labelBoundaries.width / 2;
		  labelBoundaries.ycenter = labelBoundaries.ymin + labelBoundaries.height / 2;

		  boundaries[label] = labelBoundaries;
		}
	}

	return boundaries;
}