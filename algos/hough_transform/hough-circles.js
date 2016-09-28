var Jimp = require('jimp')
var _ = require('lodash')

var HoughCircles = {};

HoughCircles.process = function(image, circleCount, threshold, minRadius, maxRadius) {

	var mergedAcc = [];

	
	var mergedAcc = []
	for (var radius = minRadius; radius <= maxRadius; radius++) {
		var acc = this.computeAcc(image, radius) 
		var prunedAcc = this.pruneAcc(image, acc, threshold) 

		mergedAcc = this.mergeAcc(image, mergedAcc, prunedAcc)

		process.stdout.write("Computing Hough Transform for radius " + radius + "\r");
	}
	console.log('')
	mergedAcc = this.groupCloseAcc(image, mergedAcc);

	var max = this.findMaxAcc(image, mergedAcc)
	var normalizedAcc = this.normalizeAcc(image, mergedAcc, max)
	var r = 4 //TODO
	this.findMaxima(image, r, normalizedAcc, circleCount)

	console.log('done')
}

HoughCircles.initAcc = function(image) {
	
	var width = image.bitmap.width
	var height = image.bitmap.height

	// for polar we need accumulator of 180degress * the longest length in the image
	var acc = []
	for(var x=0;x<width;x++) {
		for(var y=0;y<height;y++) {
			acc[x + width*y] = 0;
		}
	}

	return acc			
}

HoughCircles.pruneAcc = function(image, acc, threshold) {
	
	var width = image.bitmap.width
	var height = image.bitmap.height

	// for polar we need accumulator of 180degress * the longest length in the image
	var prunedAcc = []
	for(var x=0;x<width;x++) {
		for(var y=0;y<height;y++) {
			var value = acc[x + width*y]
			prunedAcc[x + width*y] = value > threshold ? value : 0
		}
	}

	return prunedAcc			
}

HoughCircles.mergeAcc = function(image, currentAcc, accToMerge) {
	
	var width = image.bitmap.width
	var height = image.bitmap.height

	// for polar we need accumulator of 180degress * the longest length in the image
	var mergedAcc = []

	if(currentAcc && currentAcc.length > 0){
		for(var x=0;x<width;x++) {
			for(var y=0;y<height;y++) {
				mergedAcc[x + width*y] = Math.max(currentAcc[x + width*y],accToMerge[x + width*y]);
			}
		}
	}
	else{
		mergedAcc = accToMerge
	}

	return mergedAcc			
}

HoughCircles.groupCloseAcc = function(image, acc) {
	
	var width = image.bitmap.width
	var height = image.bitmap.height

	// for polar we need accumulator of 180degress * the longest length in the image
	var groupedAcc = []
	for(var x=0;x<width;x++) {
		for(var y=0;y<height;y++) {
			var value = acc[x + width*y]
			var closeValues = [
				acc[x + 1 + width * y],	
				acc[x + 1 + width * (y + 1)],
				acc[x + 1 + width * (y - 1)],			
				acc[x - 1 + width * y],		
				acc[x - 1 + width * (y + 1)],
				acc[x - 1 + width * (y - 1)],		
				acc[x + width * (y + 1)],				
				acc[x + width * (y - 1)]
			]

			var isCloseToGreaterValue = _.some(closeValues, closeValue => closeValue > value)
			groupedAcc[x + width*y] = isCloseToGreaterValue ? 0 : value
		}
	}

	return groupedAcc			
}

HoughCircles.computeAcc = function(image, radius) {
	
	var width = image.bitmap.width
	var height = image.bitmap.height

	// for polar we need accumulator of 180degress * the longest length in the image
	var acc = []
	for(var x=0;x<width;x++) {
		for(var y=0;y<height;y++) {
			acc[x + width*y] =0 ;
		}
	}			

	var x0
	var y0
	
	//Compute accumulation matrix for each bitmap pixel
	for(var x=0;x<width;x++) {	

		//console.log('', 'Accumulation', x, '/', width)

		for(var y=0;y<height;y++) {

			//If the pixel is black
			var pixelColorHex = image.getPixelColor(x, y)
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
					if(x0 < width && x0 > 0 && y0 < height && y0 > 0) {
						acc[x0 + (y0 * width)] += 1;
					}
				}
			}
		}
	}

	return acc;
}

HoughCircles.findMaxAcc = function(image, acc) {

	var width = image.bitmap.width
	var height = image.bitmap.height

	// now normalise to 255 and put in format for a pixel array
	var max=0;

	// Find max acc value
	for(var x=0;x<width;x++) {

		//console.log('', 'Find max accumulation', x, '/', width)

		for(var y=0;y<height;y++) {
			if (acc[x + (y * width)] > max) {
				max = acc[x + (y * width)];
			}			
		}
	}

	return max
}

HoughCircles.normalizeAcc = function(image, acc, max) {

	var normalizedAcc = []

	var width = image.bitmap.width
	var height = image.bitmap.height

	// Normalise all the values
	var value, hexValue;
	for(var x=0;x<width;x++) {

		//console.log('', 'Normalize accumulations', x, '/', width)

		for(var y=0;y<height;y++) {
			value = Math.round((acc[x + (y * width)]/max)*255.0)
			//DEL acc[x + (y * width)] = 0xff000000 | (value << 16 | value << 8 | value);
			hexValue = Jimp.rgbaToInt(value, value, value, 255)
			normalizedAcc[x + (y * width)] = hexValue;
		}
	}

	//DEBUG : display Hough accumulator
	var houghImage = image.clone()
	for(var x=0;x<width;x++) {
		for(var y=0;y<height;y++) {
			var value = normalizedAcc[x + (y * width)]
			houghImage.setPixelColor(value, x, y)
		}
	}
	houghImage.write("output/3-houghAcc.jpg")

	return normalizedAcc;
}


HoughCircles.findMaxima = function(image, radius, normalizedAcc, circleCount) {

	var width = image.bitmap.width
	var height = image.bitmap.height

	//DEL var results = new int[accSize*3];
	var results = [];
	for (var resultIndex = 0; resultIndex < circleCount*3; resultIndex++) {
		results[resultIndex] = 0;
	}

	for(var x=0;x<width;x++) {
		for(var y=0;y<height;y++) {

			//DEL var value = (acc[x + (y * width)] & 0xff);
			var value = Jimp.intToRGBA(normalizedAcc[x + (y * width)]).r
			
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

	var ratio=(width/2.)/circleCount;
	//console.log("top "+accSize+" matches:");
	for(var i=circleCount-1; i>=0; i--){			
		//console.log("value: " + results[i*3] + ", r: " + results[i*3+1] + ", theta: " + results[i*3+2]);
		
		var circleCenterX = results[i*3+1]
		var circleCenterY = results[i*3+2]
		var value = results[i*3]

		if(value > 0){
			console.log('', 'Find maxima', (circleCount - i), '/', circleCount, ':', circleCenterX, circleCenterY, '(', value, ')')
			drawCircle(image, radius, value, circleCenterX, circleCenterY);
			
			//TEST Display circle center
			var red = Jimp.rgbaToInt(255, 0, 0, 255)
			image.setPixelColor(red, circleCenterX, circleCenterY)
		}
	}
}

// draw circle at x y
var drawCircle = function(image, radius, pix, xCenter, yCenter) {
	pix = 250;
	
	var x, y, r2;
	r2 = radius * radius;
	setPixel(image, pix, xCenter, yCenter + radius);
	setPixel(image, pix, xCenter, yCenter - radius);
	setPixel(image, pix, xCenter + radius, yCenter);
	setPixel(image, pix, xCenter - radius, yCenter);

	y = radius;
	x = 1;
	y = Math.round(Math.sqrt(r2 - 1) + 0.5);
	while (x < y) {
		    setPixel(image, pix, xCenter + x, yCenter + y);
		    setPixel(image, pix, xCenter + x, yCenter - y);
		    setPixel(image, pix, xCenter - x, yCenter + y);
		    setPixel(image, pix, xCenter - x, yCenter - y);
		    setPixel(image, pix, xCenter + y, yCenter + x);
		    setPixel(image, pix, xCenter + y, yCenter - x);
		    setPixel(image, pix, xCenter - y, yCenter + x);
		    setPixel(image, pix, xCenter - y, yCenter - x);
		    x += 1;
		    y = Math.round(Math.sqrt(r2 - x*x) + 0.5);
	}
	if (x == y) {
		    setPixel(image, pix, xCenter + x, yCenter + y);
		    setPixel(image, pix, xCenter + x, yCenter - y);
		    setPixel(image, pix, xCenter - x, yCenter + y);
		    setPixel(image, pix, xCenter - x, yCenter - y);
	}
}

var setPixel = function(image, value, xPos, yPos) {
	//DEL output[(yPos * width)+xPos] = 0xff000000 | (value << 16 | value << 8 | value);
	//DEL var hexValue = 0xff000000 | (value << 16 | value << 8 | value)
	
	//TODO TEST
	//var hexValue = Jimp.rgbaToInt(value, value, value, 255)
	var hexValue = Jimp.rgbaToInt(value, 0, 0, 255)
	image.setPixelColor(hexValue, xPos, yPos)	
}

module.exports = HoughCircles


