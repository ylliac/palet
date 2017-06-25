import {
  houghAccumulation,
  computeForRadius,
  applyThreshold,
  mergeWith,
  groupMaxima,
  normalize,
  drawMaxima
} from './hough-accumulation'

const circleDetection = (image, circleCount, threshold, minRadius, maxRadius) => {
  const mergedAcc = houghAccumulation(image)

  for (var radius = minRadius; radius <= maxRadius; radius++) {
    const acc = houghAccumulation(image)
    computeForRadius(acc, radius)
    applyThreshold(acc, threshold)

    mergeWith(mergedAcc, acc)

    console.log('Computing Hough Transform for radius ' + radius + '\r')
  }
  console.log('')

  groupMaxima(mergedAcc)
  normalize(mergedAcc)

  drawMaxima(mergedAcc, circleCount)

  console.log('done')

  return mergedAcc.image
}

export default circleDetection
