import {
  houghAccumulation,
  houghAccumulationGPU,
  computeForRadius,
  computeForRadiusReverse,
  computeForRadiusGPU,
  applyThreshold,
  applyThresholdGPU,
  mergeWith,
  mergeWithGPU,
  groupMaxima,
  groupMaximaGPU,
  normalize,
  drawMaxima,
  debug
} from './hough-accumulation'
import _ from 'lodash'

const circleDetection = (image, circleCount, threshold, minRadius, maxRadius) => {
  const mergedAcc = houghAccumulation(image)
  const mergedAccGPU = houghAccumulationGPU(image)

  for (var radius = minRadius; radius <= maxRadius; radius++) {
    const acc = houghAccumulation(image)
    computeForRadius(acc, radius)
    applyThreshold(acc, threshold)

    const accGPU = houghAccumulationGPU(image)
    computeForRadiusGPU(accGPU, radius)
    accGPU.accumulation = accGPU.accumulation.map(typedArray => Array.from(typedArray))
    applyThresholdGPU(accGPU, threshold)
    accGPU.accumulation = accGPU.accumulation.map(typedArray => Array.from(typedArray))

    mergeWith(mergedAcc, acc)
    mergeWithGPU(mergedAccGPU, accGPU)
    mergedAccGPU.accumulation = mergedAccGPU.accumulation.map(typedArray => Array.from(typedArray))

    console.log('Computing Hough Transform for radius ' + radius + '\r')
  }

  // computeForRadiusReverse(mergedAcc, 13)
  // computeForRadiusGPU(mergedAccGPU, 13)
  // mergedAccGPU.accumulation = mergedAccGPU.accumulation.map(typedArray => Array.from(typedArray))
  // applyThreshold(mergedAcc, threshold)
  // applyThresholdGPU(mergedAccGPU, threshold)

  // applyThreshold(mergedAcc, threshold)
  console.log('')

  groupMaxima(mergedAcc)
  groupMaximaGPU(mergedAccGPU)

  normalize(mergedAcc)
  normalize(mergedAccGPU)

  // TODO Equality check
  for (var y = 0; y < image.bitmap.height; y++) {
    // console.log('y', mergedAcc.accumulation[y], mergedAccGPU.accumulation[y])
    for (var x = 0; x < image.bitmap.width; x++) {
      // const equal2 = _.isEqual(mergedAcc.accumulation[y][x], mergedAccGPU.accumulation[y][x])
      const equal2 = Math.abs(mergedAcc.accumulation[y][x] - mergedAccGPU.accumulation[y][x]) < 5 // TODO Essayer de réduire cet écart
      if (!equal2) {
        console.log('not equal2', x, y, mergedAcc.accumulation[y][x], mergedAccGPU.accumulation[y][x])
      }
    }
  }

  drawMaxima(mergedAcc, circleCount)
  drawMaxima(mergedAccGPU, circleCount)

  console.log('done')

  // debug(mergedAcc)
  return mergedAcc.image
  // debug(mergedAccGPU)
  // return mergedAccGPU.image
}

export default circleDetection
