var _ = require('lodash');

var ACTION_TYPE = 'DRAW_WINNER_BLOB';

module.exports.type = ACTION_TYPE;

module.exports.action = function(){
	return {
		type: ACTION_TYPE
	};
};

module.exports.apply = function(state, action){

	var blobBoundaries = state.get('blobBoundaries');
	var blobList = _.map(blobBoundaries, (blobBoundaries, blobLabel) => blobLabel);

	var scanner = drawWinner(state.get('blobMap'), state.get('referenceBlob'), state.get('closestBlob'), blobList);
	
	return state
		.set('image', state.get('image').scan(0, 0, state.get('image').bitmap.width, state.get('image').bitmap.height, scanner));
};

function drawWinner(blobMap, referenceBlob, closestBlob, blobList){

	return function(x, y, idx){
		var label = blobMap[y][x];
		// does the pixel belong to the reference blob?
		if (label.toString()===referenceBlob) {
			// if so, color it in purple
			this.bitmap.data[idx] = 255;
			this.bitmap.data[idx+1] = 0;
			this.bitmap.data[idx+2] = 255;
		} 
		// else does the pixel belong to the closest blob?
		else if (label===closestBlob.label) {
				// if so, color it in green
				this.bitmap.data[idx] = 0;
				this.bitmap.data[idx+1] = 255;
				this.bitmap.data[idx+2] = 0;
				// does the pixel is the closest one?
				if(y===closestBlob.y && x===closestBlob.x){
					console.log('draw closest pixel: ',x,' ',y,' ',label);
					// if so, color only the pixel in red
					this.bitmap.data[idx] = 255;
					this.bitmap.data[idx+1] = 0;
					this.bitmap.data[idx+2] = 0;
				}
			}
		
		return;
	};
}