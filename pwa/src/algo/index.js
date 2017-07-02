import edgeDetection from './edge-detection'
import circleDetection from './circle-detection'
import circleDetectionGPU from './circle-detection.gpu'
import circleDetectionGPUoptim1 from './circle-detection.gpu.optim1'
import circleDetectionGPUoptim2 from './circle-detection.gpu.optim2'
import threshold from './threshold'

export const CPU = 'CPU'
export const GPU_SIMPLE = 'GPU_SIMPLE'
export const GPU_OPTIM1 = 'GPU_OPTIM1'
export const GPU_OPTIM2 = 'GPU_OPTIM2'

export default function processImage (image, mode) {
  const computeMode = mode || CPU

  var colorThreshold = 150
  var minRadius = 10
  var maxRadius = 30
  var circleCount = 12
  var angleThreshold = 200 // 0-360

  image = edgeDetection(image)

  console.log('Computed Edge Detection')

  image = threshold(image, colorThreshold)

  console.log('Computed Threshold')

  if (computeMode === CPU) {
    image = circleDetection(image, circleCount, angleThreshold, minRadius, maxRadius)
  } else if (computeMode === GPU_SIMPLE) {
    image = circleDetectionGPU(image, circleCount, angleThreshold, minRadius, maxRadius)
  } else if (computeMode === GPU_OPTIM1) {
    image = circleDetectionGPUoptim1(image, circleCount, angleThreshold, minRadius, maxRadius)
  } else if (computeMode === GPU_OPTIM2) {
    image = circleDetectionGPUoptim2(image, circleCount, angleThreshold, minRadius, maxRadius)
  }

  console.log('Computed Circle Detection')

  return image
}
