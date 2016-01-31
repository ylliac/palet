var ACTION_TYPE = 'DRAW_WINNER_BLOB';

module.exports.type = ACTION_TYPE;

module.exports.action = function(){
	return {
		type: ACTION_TYPE
	};
};

module.exports.apply = function(state, action){

	var scanner = drawWinner(state.get('blobMap'), state.get('referenceBlob'), state.get('winnerBlob'));

	return state
		.set('image', state.get('image').scan(0, 0, state.get('image').bitmap.width, state.get('image').bitmap.height, scanner));
};

function drawWinner(blobMap, referenceBlob, winnerBlob){

	return function(x, y, idx){
		var label = blobMap[y][x].toString();

		//Check if the pixel belongs to the 'petit'
		if(label === referenceBlob){
			//If so, color it in black
			this.bitmap.data[idx] = 0;
			this.bitmap.data[idx+1] = 0;
			this.bitmap.data[idx+2] = 0;
			return;
		}

		//Check if the pixel belongs to the winner
		if(label === winnerBlob){
			//If so, color it in green
			this.bitmap.data[idx] = 0;
			this.bitmap.data[idx+1] = 255;
			this.bitmap.data[idx+2] = 0;
			return;
		}

		//Check if the pixel belongs to a loser
		if(label !== '0'){
			//If so, color it in red
			this.bitmap.data[idx] = 255;
			this.bitmap.data[idx+1] = 0;
			this.bitmap.data[idx+2] = 0;
			return;
		}	
	};
}