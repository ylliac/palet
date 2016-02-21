module.exports.type = GREYSCALE;

module.exports.apply = function(state, action){
	return state
		.set('image', state.get('image').greyscale());
};