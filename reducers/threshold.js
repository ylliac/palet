var Jimp = require("jimp");

var ACTION_TYPE = 'THRESHOLD';

module.exports.type = ACTION_TYPE;

module.exports.action = function(){
	return {
		type: ACTION_TYPE
	};
};

module.exports.apply = function(state, action){
	return state
		.set('image', state.get('image').scan(0, 0, state.get('image').bitmap.width, state.get('image').bitmap.height, threshold));
};

function threshold(x, y, idx) {
	// x, y is the position of this pixel on the image
	// idx is the position start position of this rgba tuple in the bitmap Buffer
	// this is the image

	var red   = this.bitmap.data[ idx + 0 ];
	var green = this.bitmap.data[ idx + 1 ];
	var blue  = this.bitmap.data[ idx + 2 ];
	var alpha = this.bitmap.data[ idx + 3 ];
	
	var color = Jimp.rgbaToInt(red, green, blue, alpha);
	
	if(color > 0x44444444 ){
		this.bitmap.data[idx] = 255;
		this.bitmap.data[idx+1] = 255;
		this.bitmap.data[idx+2] = 255;
	}
	else{		
		this.bitmap.data[idx] = 0;
		this.bitmap.data[idx+1] = 0;
		this.bitmap.data[idx+2] = 0;
	}
}