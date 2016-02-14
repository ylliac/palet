var ACTION_TYPE = 'ELIMINATE_SMALL_BLOBS';

module.exports.type = ACTION_TYPE;

module.exports.action = function(minSize){
	return {
		type: ACTION_TYPE,
		minSize: minSize
	};
};

module.exports.apply = function(state, action){
	var onlyBigBlobBoundaries = eliminateSmallBlobBoundaries(state.get('blobBoundaries'), action.minSize);

	return state
		.set('blobBoundaries', onlyBigBlobBoundaries);
};

function eliminateSmallBlobBoundaries(blobBoundaries, minSize){
	var result = {};

	for(var currentLabel in blobBoundaries){
		var currentBoundaries = blobBoundaries[currentLabel];

		if(currentBoundaries.width >= minSize && currentBoundaries.height >= minSize){
			result[currentLabel] = currentBoundaries;
		}
	}

	return result;
}