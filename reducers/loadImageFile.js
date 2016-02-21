//https://github.com/oliver-moran/jimp
var Jimp = require("jimp");
var loadImage = require('./loadImage');
const createAction = require('redux-actions').createAction;

module.exports.type = LOAD_IMAGE_FILE;

module.exports.action = function(imageFileName){
	return function (dispatch) {
		return Jimp.read(imageFileName)
			.then(function (image) {
				dispatch(
					createAction(LOAD_IMAGE)({imageFileName, image})
				);
			});
	};
};


