import Jimp from 'jimp'

const threshold = (image, threshold) => {
  var width = image.bitmap.width
  var height = image.bitmap.height

  var white = Jimp.rgbaToInt(255, 255, 255, 255)

  var sobelThreshold = image.clone()
  for (var x = 0; x < width; x++) {
    for (var y = 0; y < height; y++) {
      var pixelColorHex = image.getPixelColor(x, y)
      var pixelColor = Jimp.intToRGBA(pixelColorHex).r
      var value = pixelColor >= threshold ? white : 0

      sobelThreshold.setPixelColor(value, x, y)
    }
  }

  return sobelThreshold
}

export default threshold
