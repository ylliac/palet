var ACTION_TYPE = 'COLORIZE_BLOBS';

module.exports.type = ACTION_TYPE;

module.exports.action = function(){
	return {
		type: ACTION_TYPE
	};
};

module.exports.apply = function(state, action){

	var scanner = colorizeBlobsScanner(state.get('blobMap'));

	return state
		.set('image', state.get('image').scan(0, 0, state.get('image').bitmap.width, state.get('image').bitmap.height, scanner));
};

function colorizeBlobsScanner(blobMap){

	var colorMap = [
		[255, 255, 255],
		[255, 0, 0],
		[0, 255, 0],
		[0, 0, 255]
	];

	return function(x, y, idx){

		var label = blobMap[y][x];

		var color = colorMap[label] || [0,0,0];
		
		if(color){
			this.bitmap.data[idx] = color[0];
			this.bitmap.data[idx+1] = color[1];
			this.bitmap.data[idx+2] = color[2];
		}
	}
}