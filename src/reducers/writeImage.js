module.exports.type = WRITE_IMAGE;

module.exports.apply = function(state, action){

	state.get('image').write(action.payload);

	return state;
};