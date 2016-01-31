var ACTION_TYPE = 'LOAD_IMAGE';

module.exports.type = ACTION_TYPE;

module.exports.action = function(imageFileName, image){
	return {
		type: ACTION_TYPE,
		imageFileName: imageFileName,
		image: image
	};
};

module.exports.apply = function(state, action){
	return state
		.set('imageFileName', action.imageFileName)
		.set('image', action.image);
};