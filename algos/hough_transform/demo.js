var Jimp = require('jimp')
var Sobel = require('sobel')
var HoughCircles = require('./hough-circles')

var imageFileName = 'real1_xs.jpg'
Jimp
	.read(imageFileName)
	.then(function (image) {
		run(image)
	})
	.catch(function (err) {
	    console.error(err);
	});


function run(image){

	var sobelData = Sobel(image.bitmap)
	var sobelImageData = sobelData.toImageData()
	image.bitmap.data = Buffer.from(sobelImageData.data)

	console.log('Computed Sobel')
	image.write("output/sobel.jpg")


	//DEBUG : display sobel with only white pixels	
	var width = image.bitmap.width
	var height = image.bitmap.height
	var sobelWhite = image.clone()
	for(var x=0;x<width;x++) {
		for(var y=0;y<height;y++) {
			var pixelColorHex = image.getPixelColor(x, y)
			var pixelColor = Jimp.intToRGBA(pixelColorHex).r
			var value = pixelColor === 255 ? pixelColorHex : 0 
			sobelWhite.setPixelColor(value, x, y)
		}
	}
	sobelWhite.write("output/sobelWhite.jpg")

	//TODO Faire un vote en 3D (x,y, radius)
	// Pour un radius, garder que les 12 meilleurs, 
	// puis faire le radius suivant et ne garder que les 12 meilleurs cumulés... ?

	var circleCount = 30 
	var threshold = 270 //0-360
	HoughCircles.process(image, circleCount, threshold);

	console.log('Computed Hough')
	image.write("output/hough.jpg")
}






