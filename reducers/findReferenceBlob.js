var ACTION_TYPE = 'FIND_REFERENCE_BLOB';

module.exports.type = ACTION_TYPE;

module.exports.action = function(){
	return {
		type: ACTION_TYPE
	};
};

module.exports.apply = function(state, action){
	var referenceBlob = findReferenceBlob(state.get('blobBoundaries'));

	return state
		.set('referenceBlob', referenceBlob);
};

function findReferenceBlob(blobBoundaries){
	//Get the smallest blob: it is the 'petit'
	var result = null;
	var minWidth = null;
	for(var currentLabel in blobBoundaries){
		if(currentLabel === '0') continue;

		var currentBoundaries = blobBoundaries[currentLabel];

		if(!result || currentBoundaries.width < minWidth){
			result = currentLabel;
			minWidth = currentBoundaries.width;
		}
	}
	//TODO ACY : gérer le cas où le petit n'est pas sur l'image

	return result;
}