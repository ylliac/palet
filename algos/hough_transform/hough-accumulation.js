var Jimp = require('jimp')
var _ = require('lodash')


var houghAccumulation = function(image){

	var HoughAccumulation = {}

	var _acc
	var _accRadius
	var _width
	var _height
	var _image

	var initFrom = function(image){
		_width = image.bitmap.width
		_height = image.bitmap.height
		_image = image.clone()

		_acc = []
		_accRadius = []
		for(var x=0;x<_width;x++) {
			for(var y=0;y<_height;y++) {
				_acc[x + _width*y] = 0;
				_accRadius[x + _width*y] = 0;
			}
		}	
	}

	HoughAccumulation.accumulation = function(){
		return _acc
	}	

	HoughAccumulation.accumulationRadius = function(){
		return _accRadius
	}	

	HoughAccumulation.image = function(){
		return _image
	}	

	HoughAccumulation.export = function(imageFileName){
		var exportedImage = _image.clone()
		for(var x=0;x<_width;x++) {
			for(var y=0;y<_height;y++) {
				var value = _acc[x + (y * _width)]
				exportedImage.setPixelColor(value, x, y)
			}
		}
		exportedImage.write(imageFileName)
	}	

	HoughAccumulation.computeForRadius = function(radius){
		var x0
		var y0

		//Compute accumulation matrix for each bitmap pixel
		for(var x=0;x<_width;x++) {	

			//console.log('', 'Accumulation', x, '/', width)

			for(var y=0;y<_height;y++) {

				//If the pixel is black
				var pixelColorHex = _image.getPixelColor(x, y)
				var pixelColor = Jimp.intToRGBA(pixelColorHex).r

				//DEL if ((pixelColor & 0xff) == 255) {
				if (pixelColor === 255) {
				
					//We compute every circle passing by this point
					//using this formula: 
					// x = x0 + r * cos(theta)
					// x = y0 + r * sin(theta)

					for (var theta=0; theta<360; theta++) {
						theta_rad = (theta * 3.14159265) / 180;
						x0 = Math.round(x - radius * Math.cos(theta_rad));
						y0 = Math.round(y - radius * Math.sin(theta_rad));
						if(x0 < _width && x0 > 0 && y0 < _height && y0 > 0) {
							_acc[x0 + (y0 * _width)] += 1;
							_accRadius[x0 + (y0 * _width)] = radius;
						}
					}
				}
			}
		}
	}

	HoughAccumulation.applyThreshold = function(threshold) {
		for(var x=0;x<_width;x++) {
			for(var y=0;y<_height;y++) {
				if(_acc[x + _width*y] <= threshold){
					_acc[x + _width*y] = 0
					_accRadius[x + _width*y] = 0
				}
			}
		}			
	}

	HoughAccumulation.mergeWith = function(accToMerge) {
		var otherAcc = accToMerge.accumulation()
		var otherAccRadius = accToMerge.accumulationRadius()

		for(var x=0;x<_width;x++) {
			for(var y=0;y<_height;y++) {
				_acc[x + _width*y] = Math.max(_acc[x + _width*y], otherAcc[x + _width*y])
				_accRadius[x + _width*y] = Math.max(_accRadius[x + _width*y], otherAccRadius[x + _width*y])
			}
		}			
	}

	HoughAccumulation.groupMaxima = function() {
		
		var groupedAcc = []
		for(var x=0;x<_width;x++) {
			for(var y=0;y<_height;y++) {
				var value = _acc[x + _width*y]
				var closeValues = [
					_acc[x + 1 + _width * y],	
					_acc[x + 1 + _width * (y + 1)],
					_acc[x + 1 + _width * (y - 1)],			
					_acc[x - 1 + _width * y],		
					_acc[x - 1 + _width * (y + 1)],
					_acc[x - 1 + _width * (y - 1)],		
					_acc[x + _width * (y + 1)],				
					_acc[x + _width * (y - 1)]
				]

				var isCloseToGreaterValue = _.some(closeValues, closeValue => closeValue > value)
				if(isCloseToGreaterValue){
					groupedAcc[x + _width*y] = 0
					_accRadius[x + _width*y] = 0
				}
				else{
					groupedAcc[x + _width*y] = value
				}
			}
		}

		_acc = groupedAcc			
	}

	HoughAccumulation.getMaxAccumulation = function() {

		// now normalise to 255 and put in format for a pixel array
		var max=0;

		// Find max acc value
		for(var x=0;x<_width;x++) {

			//console.log('', 'Find max accumulation', x, '/', width)

			for(var y=0;y<_height;y++) {
				if (_acc[x + (y * _width)] > max) {
					max = _acc[x + (y * _width)];
				}			
			}
		}

		return max
	}

	HoughAccumulation.normalize = function() {

		var max = this.getMaxAccumulation()

		// Normalise all the values
		var value, hexValue;
		for(var x=0;x<_width;x++) {

			//console.log('', 'Normalize accumulations', x, '/', width)

			for(var y=0;y<_height;y++) {
				value = Math.round((_acc[x + (y * _width)]/max)*255.0)
				//DEL acc[x + (y * width)] = 0xff000000 | (value << 16 | value << 8 | value);
				hexValue = Jimp.rgbaToInt(value, value, value, 255)
				_acc[x + (y * _width)] = hexValue
			}
		}

		//DEBUG : display Hough accumulator
		this.export("output/3-houghAcc.jpg")
	}

	HoughAccumulation.drawMaxima = function(circleCount) {

		var results = []
		for (var resultIndex = 0; resultIndex < circleCount; resultIndex++) {
			results[resultIndex] = {value: 0};
		}

		for(var x=0;x<_width;x++) {
			for(var y=0;y<_height;y++) {

				var value = Jimp.intToRGBA(_acc[x + (y * _width)]).r
				
				// if its higher than lowest value add it and then sort
				if (value > results[(circleCount-1)].value) {

					radius = _accRadius[x + (y * _width)]

					// add to bottom of array
					results[(circleCount-1)] = {
						x: x,
						y: y,
						value: value,
						radius: radius
					}
				
					// shift up until its in right place
					var i = (circleCount-2)
					while ((i >= 0) && (results[i+1].value > results[i].value)) {
						var temp = results[i];
						results[i] = results[i+1];
						results[i+1] = temp;
						i = i - 1;
						if (i < 0) break;
					}
				}
			}
		}

		var minRadius = _.min(_.map(results, result => result.radius))


		for(var i=circleCount-1; i>=0; i--){			
	
			var result = results[i]

			if(result.value > 0){				
				if(result.radius === minRadius){
					console.log('', 'Found smallest something', (circleCount - i), '/', circleCount, ':', result)
					drawCircleInBlue(result.x, result.y)
				}
				else{
					console.log('', 'Found something', (circleCount - i), '/', circleCount, ':', result)
					drawCircleInRed(result.x, result.y)					
				}
			}
		}
	}

	var drawCircleInRed = function(xCenter, yCenter) {
		var red = Jimp.rgbaToInt(255, 0, 0, 255)
		drawCircle(xCenter, yCenter, red)
	}

	var drawCircleInGreen = function(xCenter, yCenter) {
		var green = Jimp.rgbaToInt(0, 255, 0, 255)
		drawCircle(xCenter, yCenter, green)
	}

	var drawCircleInBlue = function(xCenter, yCenter) {
		var blue = Jimp.rgbaToInt(0, 0, 255, 255)
		drawCircle(xCenter, yCenter, blue)
	}

	var drawCircle = function(xCenter, yCenter, color) {
		
		//Display circle center
		_image.setPixelColor(color, xCenter, yCenter)

		//Display circle
		var radius = 4
		
		var x, y, r2;
		r2 = radius * radius;
		setPixel(color, xCenter, yCenter + radius);
		setPixel(color, xCenter, yCenter - radius);
		setPixel(color, xCenter + radius, yCenter);
		setPixel(color, xCenter - radius, yCenter);

		y = radius;
		x = 1;
		y = Math.round(Math.sqrt(r2 - 1) + 0.5);
		while (x < y) {
			    setPixel(color, xCenter + x, yCenter + y);
			    setPixel(color, xCenter + x, yCenter - y);
			    setPixel(color, xCenter - x, yCenter + y);
			    setPixel(color, xCenter - x, yCenter - y);
			    setPixel(color, xCenter + y, yCenter + x);
			    setPixel(color, xCenter + y, yCenter - x);
			    setPixel(color, xCenter - y, yCenter + x);
			    setPixel(color, xCenter - y, yCenter - x);
			    x += 1;
			    y = Math.round(Math.sqrt(r2 - x*x) + 0.5);
		}
		if (x == y) {
			    setPixel(color, xCenter + x, yCenter + y);
			    setPixel(color, xCenter + x, yCenter - y);
			    setPixel(color, xCenter - x, yCenter + y);
			    setPixel(color, xCenter - x, yCenter - y);
		}
	}

	var setPixel = function(color, xPos, yPos) {
		_image.setPixelColor(color, xPos, yPos)	
	}

	initFrom(image)

	return HoughAccumulation
}

module.exports = houghAccumulation


