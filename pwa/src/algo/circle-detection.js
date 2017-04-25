var houghAccumulation = require('./hough-accumulation')

var CircleDetection = {}

CircleDetection.process = function (image, circleCount, threshold, minRadius, maxRadius) {
  var mergedAcc = houghAccumulation(image)

  for (var radius = minRadius; radius <= maxRadius; radius++) {
    var acc = houghAccumulation(image)
    acc.computeForRadius(radius)
    acc.applyThreshold(threshold)

    mergedAcc.mergeWith(acc)

    console.log('Computing Hough Transform for radius ' + radius + '\r')
  }
  console.log('')

  mergedAcc.groupMaxima()
  mergedAcc.normalize()

  mergedAcc.drawMaxima(circleCount)

  console.log('done')

  return mergedAcc.image()
}

module.exports = CircleDetection
