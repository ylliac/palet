var ACTION_TYPE = 'POSTERIZE';

module.exports.type = ACTION_TYPE;

module.exports.action = function(){
	return {
		type: ACTION_TYPE
	};
};

module.exports.apply = function(state, action){
	return state
		.set('image', state.get('image').posterize(3));
};