import now from 'performance-now'
import chalk from 'chalk'
import 'jimp/browser/lib/jimp'
import EdgeDetection from './edge-detection'
import CircleDetection from './circle-detection'
import Threshold from './threshold'

const Jimp = window.Jimp

const sample = 'https://upload.wikimedia.org/wikipedia/commons/0/01/Bot-Test.jpg'

describe('algo', () => {
  it('should process sample image', () => {
    const start = now()
    let afterRead
    return Jimp
      .read(sample)
      .then(image => {
        afterRead = now()
        console.log(chalk.red('BENCHMARK'), 'after read', (afterRead - start).toFixed(3))
        return image.resize(400, Jimp.AUTO)
      })
      .then(function (image) {
        const afterResize = now()
        console.log(chalk.red('BENCHMARK'), 'after resize', (afterResize - afterRead).toFixed(3))
        processImage(image)

        const end = now()
        console.log(chalk.red('BENCHMARK'), 'total time', (end - start).toFixed(3))
      })
      .catch(function (err) {
        console.error(err)
      })
  })
})

function processImage (image) {
  const start = now()

  var colorThreshold = 150
  var minRadius = 10
  var maxRadius = 10 // 30
  var circleCount = 12
  var angleThreshold = 200 // 0-360

  image = EdgeDetection.process(image)

  console.log('Computed Edge Detection')
  const afterEdgeDetection = now()
  console.log(chalk.red('BENCHMARK'), 'after edge detection', (afterEdgeDetection - start).toFixed(3))

  image = Threshold.process(image, colorThreshold)

  console.log('Computed Threshold')
  const afterThreshold = now()
  console.log(chalk.red('BENCHMARK'), 'after threshold', (afterThreshold - afterEdgeDetection).toFixed(3))

  image = CircleDetection.process(image, circleCount, angleThreshold, minRadius, maxRadius)

  console.log('Computed Circle Detection')
  const afterCircleDetection = now()
  console.log(chalk.red('BENCHMARK'), 'after circle detection', (afterCircleDetection - afterThreshold).toFixed(3))

  console.log(chalk.red('BENCHMARK'), 'total algo time', (afterCircleDetection - start).toFixed(3))

  return image
}
