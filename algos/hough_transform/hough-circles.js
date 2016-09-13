var Jimp = require('jimp')

var HoughCircles = {};

var r;
var input;
var accSize;
var acc;

HoughCircles.setCircleCount = function(circleCount) {
	accSize=circleCount;		
}

HoughCircles.process = function(image, radius) {
	
	var width = image.bitmap.width
	var height = image.bitmap.height

	// for polar we need accumulator of 180degress * the longest length in the image
	acc = []
	for(var x=0;x<width;x++) {
		for(var y=0;y<height;y++) {
			acc[x + width*y] =0 ;
		}
	}			

	var x0
	var y0
	
	//TODO TEST
	var whiteImage = image.clone()

	//Compute accumulation matrix for each bitmap pixel
	for(var x=0;x<width;x++) {	

		console.log('', 'Accumulation', x, '/', width)

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

				//TODO
				//console.log('white', x, y)
				var green = Jimp.rgbaToInt(0, 255, 0, 255)
				whiteImage.setPixelColor(green, x, y)
			}
		}
	}
	whiteImage.write("output/white.jpg")

	// now normalise to 255 and put in format for a pixel array
	var max=0;

	// Find max acc value
	for(var x=0;x<width;x++) {

		console.log('', 'Find max accumulation', x, '/', width)

		for(var y=0;y<height;y++) {
			if (acc[x + (y * width)] > max) {
				max = acc[x + (y * width)];
			}			
		}
	}
	console.log('Max is', max)

	// Normalise all the values
	var value, hexValue;
	for(var x=0;x<width;x++) {

		console.log('', 'Normalize accumulations', x, '/', width)

		for(var y=0;y<height;y++) {
			value = Math.round((acc[x + (y * width)]/max)*255.0)
			//DEL acc[x + (y * width)] = 0xff000000 | (value << 16 | value << 8 | value);
			hexValue = Jimp.rgbaToInt(value, value, value, 255)
			acc[x + (y * width)] = hexValue;
		}
	}

	//DEBUG : display Hough accumulator
	var houghImage = image.clone()
	for(var x=0;x<width;x++) {
		for(var y=0;y<height;y++) {
			var value = acc[x + (y * width)]
			houghImage.setPixelColor(value, x, y)
		}
	}
	houghImage.write("output/houghAcc.jpg")

	findMaxima(image, radius);

	console.log('done')
}


var findMaxima = function(image, radius) {

	var width = image.bitmap.width
	var height = image.bitmap.height

	//DEL var results = new int[accSize*3];
	var results = [];
	for (var resultIndex = 0; resultIndex < accSize*3; resultIndex++) {
		results[resultIndex] = 0;
	}

	for(var x=0;x<width;x++) {
		for(var y=0;y<height;y++) {

			//DEL var value = (acc[x + (y * width)] & 0xff);
			var value = Jimp.intToRGBA(acc[x + (y * width)]).r
			
			// if its higher than lowest value add it and then sort
			if (value > results[(accSize-1)*3]) {

				// add to bottom of array
				results[(accSize-1)*3] = value;
				results[(accSize-1)*3+1] = x;
				results[(accSize-1)*3+2] = y;
			
				// shift up until its in right place
				var i = (accSize-2)*3;
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

	var ratio=(width/2.)/accSize;
	//console.log("top "+accSize+" matches:");
	for(var i=accSize-1; i>=0; i--){			
		//console.log("value: " + results[i*3] + ", r: " + results[i*3+1] + ", theta: " + results[i*3+2]);
		
		var circleCenterX = results[i*3+1]
		var circleCenterY = results[i*3+2]

		console.log('', 'Find maxima', (accSize - i), '/', accSize, ':', circleCenterX, circleCenterY)

		drawCircle(image, radius, results[i*3], circleCenterX, circleCenterY);

		//TEST Display circle center
		var red = Jimp.rgbaToInt(255, 0, 0, 255)
		image.setPixelColor(red, circleCenterX, circleCenterY)
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


