import {
  houghAccumulation,
  houghAccumulationGPU,
  computeForRadius,
  computeForRadiusReverse,
  computeForRadiusGPU,
  applyThreshold,
  applyThresholdGPU,
  mergeWithGPU,
  groupMaximaGPU,
  normalize,
  drawMaxima,
  debug
} from './hough-accumulation'
import _ from 'lodash'

const circleDetection = (image, circleCount, threshold, minRadius, maxRadius) => {
  const mergedAcc = houghAccumulation(image)
  const mergedAccGPU = houghAccumulationGPU(image)

  // for (var radius = minRadius; radius <= maxRadius; radius++) {
  //   const acc = houghAccumulation(image)
  //   computeForRadius(acc, radius)
  //   applyThreshold(acc, threshold)

  //   const accGPU = houghAccumulationGPU(image)
  //   computeForRadiusGPU(accGPU, radius)
  //   applyThresholdGPU(accGPU, threshold)

  //   mergeWithGPU(mergedAcc, acc)
  //   mergeWithGPU(mergedAccGPU, accGPU)

  //   console.log('Computing Hough Transform for radius ' + radius + '\r')
  // }
  computeForRadiusReverse(mergedAcc, 13)
  computeForRadiusGPU(mergedAccGPU, 13)
  applyThreshold(mergedAcc, threshold)
  applyThresholdGPU(mergedAccGPU, threshold)

  // TODO Equality check
  for (var y = 0; y < image.bitmap.height; y++) {
    // console.log('y', mergedAcc.accumulation[y], mergedAccGPU.accumulation[y])
    for (var x = 0; x < image.bitmap.width; x++) {
      const equal2 = _.isEqual(mergedAcc.accumulation[y][x], mergedAccGPU.accumulation[y][x])
      if (!equal2) {
        console.log('not equal2', x, y, mergedAcc.accumulation[y][x], mergedAccGPU.accumulation[y][x])
      }
    }
  }

  // applyThreshold(mergedAcc, threshold)
  console.log('')

  // groupMaximaGPU(mergedAcc)
  normalize(mergedAcc)
  normalize(mergedAccGPU)

  // drawMaxima(mergedAcc, circleCount)

  console.log('done')

  debug(mergedAcc)
  return mergedAcc.image
  // debug(mergedAccGPU)
  // return mergedAccGPU.image
}

export default circleDetection
