var ACTION_TYPE = 'DRAW_BLOB_BOUNDARIES';

module.exports.type = ACTION_TYPE;

module.exports.action = function(){
	return {
		type: ACTION_TYPE
	};
};

module.exports.apply = function(state, action){

	var scanner = drawBlobBoundariesScanner(state.get('blobBoundaries'));

	return state
		.set('image', state.get('image').scan(0, 0, state.get('image').bitmap.width, state.get('image').bitmap.height, scanner));
};

function drawBlobBoundariesScanner(blobBoundaries){

	return function(x, y, idx){

		//Check if the pixel belongs to a boundary
		for(var label in blobBoundaries){
			var boundary = blobBoundaries[label];

			if( (x === boundary.xmin || x === boundary.xmax) && (y === boundary.ymin || y === boundary.ymax) ){
				//If so, color this pixel in black
				this.bitmap.data[idx] = 0;
				this.bitmap.data[idx+1] = 0;
				this.bitmap.data[idx+2] = 0;
			}	
		}
	}
}