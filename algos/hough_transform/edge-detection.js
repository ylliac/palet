var Sobel = require('sobel')

var EdgeDetection = {};

EdgeDetection.process = function (image){

	var result = image.clone()

	var sobelData = Sobel(result.bitmap)
	var sobelImageData = sobelData.toImageData()
	result.bitmap.data = Buffer.from(sobelImageData.data)

	return result
}

module.exports = EdgeDetection



