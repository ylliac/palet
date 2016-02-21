module.exports.type = LOAD_IMAGE;

module.exports.apply = function(state, action){
	return state
		.set('imageFileName', action.payload.imageFileName)
		.set('image', action.payload.image);
};