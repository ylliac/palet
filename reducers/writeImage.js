var ACTION_TYPE = 'WRITE_IMAGE';

module.exports.type = ACTION_TYPE;

module.exports.action = function(outputFileName){
	return {
		type: ACTION_TYPE,
		outputFileName: outputFileName
	};
};

module.exports.apply = function(state, action){
	
	state.get('image').write(action.outputFileName);

	return state;
};