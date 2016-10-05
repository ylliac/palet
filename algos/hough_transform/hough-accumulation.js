var Jimp = require('jimp')
var _ = require('lodash')


var houghAccumulation = function(image){

	var HoughAccumulation = {}

	var _acc
	var _width
	var _height
	var _image

	var initFrom = function(image){
		_width = image.bitmap.width
		_height = image.bitmap.height
		_image = image.clone()

		_acc = []
		for(var x=0;x<_width;x++) {
			for(var y=0;y<_height;y++) {
				_acc[x + _width*y] = 0;
			}
		}	
	}

	HoughAccumulation.accumulation = function(){
		return _acc
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
						}
					}
				}
			}
		}
	}

	HoughAccumulation.applyThreshold = function(threshold) {
		for(var x=0;x<_width;x++) {
			for(var y=0;y<_height;y++) {
				var value = _acc[x + _width*y]
				_acc[x + _width*y] = value > threshold ? value : 0
			}
		}			
	}

	HoughAccumulation.mergeWith = function(accToMerge) {
		var otherAcc = accToMerge.accumulation()

		for(var x=0;x<_width;x++) {
			for(var y=0;y<_height;y++) {
				_acc[x + _width*y] = Math.max(_acc[x + _width*y], otherAcc[x + _width*y]);
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
				groupedAcc[x + _width*y] = isCloseToGreaterValue ? 0 : value
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

		//DEL var results = new int[accSize*3];
		var results = []
		for (var resultIndex = 0; resultIndex < circleCount*3; resultIndex++) {
			results[resultIndex] = 0;
		}

		for(var x=0;x<_width;x++) {
			for(var y=0;y<_height;y++) {

				//DEL var value = (acc[x + (y * width)] & 0xff);
				var value = Jimp.intToRGBA(_acc[x + (y * _width)]).r
				
				// if its higher than lowest value add it and then sort
				if (value > results[(circleCount-1)*3]) {

					// add to bottom of array
					results[(circleCount-1)*3] = value;
					results[(circleCount-1)*3+1] = x;
					results[(circleCount-1)*3+2] = y;
				
					// shift up until its in right place
					var i = (circleCount-2)*3;
					while ((i >= 0) && (results[i+3] > results[i])) {
						for(var j=0; j<3; j++) {
							var temp = results[i+j];
							results[i+j] = results[i+3+j];
							results[i+3+j] = temp;
						}
						i = i - 3;
						if (i < 0) break;
					}
				}
			}
		}

		var ratio=(_width/2.)/circleCount;
		//console.log("top "+accSize+" matches:");
		for(var i=circleCount-1; i>=0; i--){			
			//console.log("value: " + results[i*3] + ", r: " + results[i*3+1] + ", theta: " + results[i*3+2]);
			
			var circleCenterX = results[i*3+1]
			var circleCenterY = results[i*3+2]
			var value = results[i*3]

			if(value > 0){
				console.log('', 'Find maxima', (circleCount - i), '/', circleCount, ':', circleCenterX, circleCenterY, '(', value, ')')
				drawCircle(circleCenterX, circleCenterY);
			}
		}
	}

	// draw circle at x y
	var drawCircle = function(xCenter, yCenter) {
		
		//Display circle center
		var red = Jimp.rgbaToInt(255, 0, 0, 255)
		_image.setPixelColor(red, xCenter, yCenter)

		//Display circle 
		var pix = 250
		var radius = 4
		
		var x, y, r2;
		r2 = radius * radius;
		setPixel(pix, xCenter, yCenter + radius);
		setPixel(pix, xCenter, yCenter - radius);
		setPixel(pix, xCenter + radius, yCenter);
		setPixel(pix, xCenter - radius, yCenter);

		y = radius;
		x = 1;
		y = Math.round(Math.sqrt(r2 - 1) + 0.5);
		while (x < y) {
			    setPixel(pix, xCenter + x, yCenter + y);
			    setPixel(pix, xCenter + x, yCenter - y);
			    setPixel(pix, xCenter - x, yCenter + y);
			    setPixel(pix, xCenter - x, yCenter - y);
			    setPixel(pix, xCenter + y, yCenter + x);
			    setPixel(pix, xCenter + y, yCenter - x);
			    setPixel(pix, xCenter - y, yCenter + x);
			    setPixel(pix, xCenter - y, yCenter - x);
			    x += 1;
			    y = Math.round(Math.sqrt(r2 - x*x) + 0.5);
		}
		if (x == y) {
			    setPixel(pix, xCenter + x, yCenter + y);
			    setPixel(pix, xCenter + x, yCenter - y);
			    setPixel(pix, xCenter - x, yCenter + y);
			    setPixel(pix, xCenter - x, yCenter - y);
		}
	}

	var setPixel = function(value, xPos, yPos) {
		//DEL output[(yPos * width)+xPos] = 0xff000000 | (value << 16 | value << 8 | value);
		//DEL var hexValue = 0xff000000 | (value << 16 | value << 8 | value)
		
		//TODO TEST
		//var hexValue = Jimp.rgbaToInt(value, value, value, 255)
		var hexValue = Jimp.rgbaToInt(value, 0, 0, 255)
		_image.setPixelColor(hexValue, xPos, yPos)	
	}

	initFrom(image)

	return HoughAccumulation
}

module.exports = houghAccumulation


