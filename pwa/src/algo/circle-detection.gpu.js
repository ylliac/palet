import {
  houghAccumulationGPU,
  computeForRadiusGPU,
  computeForAllRadiusGPU,
  applyThresholdGPU,
  mergeWithGPU,
  groupMaximaGPU,
  normalize,
  drawMaxima
} from './hough-accumulation.gpu'

// Benchmark:
// computeForRadius: 120ms vs 80ms
// applyThreshold: 140ms vs 4ms
// mergeWith: 150ms vs 6ms

const circleDetectionGPU = (image, circleCount, threshold, minRadius, maxRadius) => {
  const mergedAccGPU = houghAccumulationGPU(image)

  for (var radius = minRadius; radius <= maxRadius; radius++) {
    const accGPU = houghAccumulationGPU(image)
    computeForRadiusGPU(accGPU, radius)
    accGPU.accumulation = accGPU.accumulation.map(typedArray => Array.from(typedArray))
    accGPU.accumulationRadius = accGPU.accumulationRadius.map(typedArray => Array.from(typedArray))
    applyThresholdGPU(accGPU, threshold)
    accGPU.accumulation = accGPU.accumulation.map(typedArray => Array.from(typedArray))
    accGPU.accumulationRadius = accGPU.accumulationRadius.map(typedArray => Array.from(typedArray))

    mergeWithGPU(mergedAccGPU, accGPU)
    mergedAccGPU.accumulation = mergedAccGPU.accumulation.map(typedArray => Array.from(typedArray))
    mergedAccGPU.accumulationRadius = mergedAccGPU.accumulationRadius.map(typedArray => Array.from(typedArray))

    console.log('Computing Hough Transform for radius ' + radius + '\r')
  }
  console.log('')

  groupMaximaGPU(mergedAccGPU)

  normalize(mergedAccGPU)

  drawMaxima(mergedAccGPU, circleCount)

  console.log('done')

  return mergedAccGPU.image
}

export default circleDetectionGPU
