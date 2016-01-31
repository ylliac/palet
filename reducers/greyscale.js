var ACTION_TYPE = 'GREYSCALE';

module.exports.type = ACTION_TYPE;

module.exports.action = function(){
	return {
		type: ACTION_TYPE
	};
};

module.exports.apply = function(state, action){
	return state
		.set('image', state.get('image').greyscale());
};