import EdgeDetection from './edge-detection'
import CircleDetection from './circle-detection'
import Threshold from './threshold'

export default function processImage (image) {
  var colorThreshold = 150
  var minRadius = 10
  var maxRadius = 30
  var circleCount = 12
  var angleThreshold = 200 // 0-360

  image = EdgeDetection.process(image)

  console.log('Computed Edge Detection')

  image = Threshold.process(image, colorThreshold)

  console.log('Computed Threshold')

  image = CircleDetection.process(image, circleCount, angleThreshold, minRadius, maxRadius)

  console.log('Computed Circle Detection')

  return image
}
