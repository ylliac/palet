//ACY 07/02 Se baser sur le centre du blob ne marche pas quand on a un blob qui englobe deux palets collés
//ACY 20/02 Plus très utile avec FIND_CLOSEST_BLOB de Flo, supprimer
module.exports.type = FIND_WINNER_BLOB;

module.exports.apply = function(state, action){
	var winnerBlob = findWinnerBlob(state.get('blobBoundaries'), state.get('referenceBlob'));
	console.log("Winner blob: ", winnerBlob, "!")
	return state
		.set('winnerBlob', winnerBlob);
};

function findWinnerBlob(blobBoundaries, referenceBlob){
	
	//Get the blob with the closest center from the 'petit': it is the winner
	var result = null;
	var minDistanceToReferenceBlob = null;
	var referenceBlobBoundaries = blobBoundaries[referenceBlob];
	for(var currentLabel in blobBoundaries){
		if(currentLabel === '0' || currentLabel === referenceBlob) continue;

		var currentBoundaries = blobBoundaries[currentLabel];

		var distanceToReferenceBlob = Math.sqrt(
				Math.pow(currentBoundaries.xcenter - referenceBlobBoundaries.xcenter, 2) +
				Math.pow(currentBoundaries.ycenter - referenceBlobBoundaries.ycenter, 2));

		if(!result || distanceToReferenceBlob < minDistanceToReferenceBlob){
			result = currentLabel;
			minDistanceToReferenceBlob = distanceToReferenceBlob;
		}
	}
	//TODO ACY Gérer le cas où deux palets sont à égale distance

	return result;
}