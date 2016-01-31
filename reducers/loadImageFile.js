//https://github.com/oliver-moran/jimp
var Jimp = require("jimp");
var loadImage = require('./loadImage');

var ACTION_TYPE = 'LOAD_IMAGE_FILE';

module.exports.type = ACTION_TYPE;

module.exports.action = function(imageFileName){
	return function (dispatch) {
		return Jimp.read(imageFileName)
			.then(function (image) {
				dispatch(loadImage.action(imageFileName, image));
			});
	};
};


