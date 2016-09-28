var Jimp = require('jimp')
var Sobel = require('sobel')
var Threshold = require('./threshold')
var HoughCircles = require('./hough-circles')

var imageFileName = '../../images/real/real1.jpg'
//var imageFileName = '../../images/real/real2.jpg'
//var imageFileName = '../../images/real/real3.jpg'
//var imageFileName = '../../images/real/real4.jpg'
//var imageFileName = '../../images/real/real5.jpg'
//var imageFileName = '../../images/real/real6.jpg'
//var imageFileName = '../../images/real/real7.jpg' //TOO CLOSE
//var imageFileName = '../../images/real/real8.jpg' //TOO MUCH GRASS AROUND
//var imageFileName = '../../images/real/real9.jpg' //TOO CLOSE
//var imageFileName = '../../images/real/real10.jpg' //TOO CLOSE

Jimp
	.read(imageFileName)
	.then(function (image) {
		var resizedImage = image.resize(400, Jimp.AUTO)
		run(resizedImage)
	})
	.catch(function (err) {
	    console.error(err);
	});


function run(image){

	var sobelData = Sobel(image.bitmap)
	var sobelImageData = sobelData.toImageData()
	image.bitmap.data = Buffer.from(sobelImageData.data)

	console.log('Computed Sobel')
	image.write("output/1-sobel.jpg")

	var colorThreshold = 150
	image = Threshold.process(image, colorThreshold)

	console.log('Computed Threshold')
	image.write("output/2-sobelThreshold.jpg")

	var minRadius = 10 
	var maxRadius = 30 
	var circleCount = 12 
	var angleThreshold = 200 //0-360
	HoughCircles.process(image, circleCount, angleThreshold, minRadius, maxRadius);

	console.log('Computed Hough')
	image.write("output/4-hough.jpg")
}






