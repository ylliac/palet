module.exports.type = POSTERIZE;

module.exports.apply = function(state, action){
	return state
		.set('image', state.get('image').posterize(3));
};