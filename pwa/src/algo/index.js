import edgeDetection from './edge-detection'
import circleDetection from './circle-detection'
import threshold from './threshold'

export default function processImage (image) {
  var colorThreshold = 150
  var minRadius = 10
  var maxRadius = 30
  var circleCount = 12
  var angleThreshold = 200 // 0-360

  image = edgeDetection(image)

  console.log('Computed Edge Detection')

  image = threshold(image, colorThreshold)

  console.log('Computed Threshold')

  image = circleDetection(image, circleCount, angleThreshold, minRadius, maxRadius)

  console.log('Computed Circle Detection')

  return image
}
