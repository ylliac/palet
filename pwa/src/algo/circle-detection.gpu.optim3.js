import {
  houghAccumulation,
  computeForAllRadiusGPU,
  drawMaxima
} from './hough-accumulation.gpu.optim3'

const circleDetectionGPU = (image, circleCount, threshold, minRadius, maxRadius) => {
  const mergedAccGPU = houghAccumulation(image)

  computeForAllRadiusGPU(mergedAccGPU, threshold)

  drawMaxima(mergedAccGPU, circleCount)

  console.log('done')

  return mergedAccGPU.image
}

export default circleDetectionGPU
