// OPTIM 1 : Utilisation de combine kernel pour combiner toutes les étapes sur GPU
/* globals Jimp */

import 'jimp/browser/lib/jimp'
import _ from 'lodash'

const gpu = new window.GPU()

export const debug = houghAcc => {
  for (let x = 0; x < houghAcc.width; x++) {
    for (let y = 0; y < houghAcc.height; y++) {
      const value = Math.min(255, Jimp.intToRGBA(houghAcc.accumulation[y][x]).r)
      if (value !== 0) console.log('value', x, y, value)
      const color = Jimp.rgbaToInt(value, 0, 0, 255)
      drawCircle(houghAcc, x, y, color)
    }
  }
}

const getMaxAccumulation = (acc, width, height) => {
    // now normalise to 255 and put in format for a pixel array
  let max = 0

    // Find max acc value
  for (let x = 0; x < width; x++) {
      // console.log('', 'Find max accumulation', x, '/', width)

    for (let y = 0; y < height; y++) {
      if (acc[y][x] > max) {
        max = acc[y][x]
      }
    }
  }

  return max
}

export const houghAccumulation = sourceImage => {
  let width = sourceImage.bitmap.width
  let height = sourceImage.bitmap.height
  let image = sourceImage.clone()

  return {
    width,
    height,
    image
  }
}

export const computeForAllRadiusGPU = (houghAcc, threshold) => {
  const init = gpu.createKernel(function (value) {
    return value
  }).setDimensions([houghAcc.width, houghAcc.height])

  const compute = gpu.createKernel(function (DATA, radius) {
    var x = this.thread.x
    var y = this.thread.y
    var width = this.dimensions.x
    var height = this.dimensions.y

    var accValue = 0
    for (var theta = 0; theta < 360; theta++) {
      var thetaRadians = (theta * 3.14159265) / 180
      var cos = x - (radius * Math.cos(thetaRadians))
      var x0 = Math.floor(cos + 0.5)
      var sin = y - (radius * Math.sin(thetaRadians))
      var y0 = Math.floor(sin + 0.5)
      if (x0 > 0 && y0 > 0 && x0 < width && y0 < height) {
        var i = ((width * y0) + x0) * 4
        var red = DATA[i]
        if (red === 255) {
          accValue++
        }
      }
    }
    return accValue
  }).setDimensions([houghAcc.width, houghAcc.height])

  const thresh = gpu.createKernel(function (ACC, DEFAULT, threshold) {
    var result
    var x = this.thread.x
    var y = this.thread.y
    var width = this.dimensions.x
    var idx = ((width * y) + x)
    var value = ACC[idx]
    if (value <= threshold) {
      result = 0
    } else {
      result = DEFAULT[idx]
    }
    return result
  }).setDimensions([houghAcc.width, houghAcc.height])

  const merge = gpu.createKernel(function (ACC1, ACC2) {
    var x = this.thread.x
    var y = this.thread.y
    var width = this.dimensions.x
    var idx = ((width * y) + x)

    return Math.max(ACC1[idx], ACC2[idx])
  }).setDimensions([houghAcc.width, houghAcc.height])

  const groupMaxima = gpu.createKernel(function (ACC) {
    var x = this.thread.x
    var y = this.thread.y
    var width = this.dimensions.x

    var value = ACC[(width * y) + x]

    if (
      (ACC[(width * y) + x + 1]) > value ||
      (ACC[(width * (y + 1)) + x + 1]) > value ||
      (ACC[(width * (y - 1)) + x + 1]) > value ||
      (ACC[(width * y) + x - 1]) > value ||
      (ACC[(width * (y + 1)) + x - 1]) > value ||
      (ACC[(width * (y - 1)) + x - 1]) > value ||
      (ACC[(width * (y + 1)) + x]) > value ||
      (ACC[(width * (y - 1)) + x]) > value
    ) {
      return 0
    } else {
      return value
    }
  }).setDimensions([houghAcc.width, houghAcc.height])

  const groupResults = gpu.createKernel(function (ACC, RADIUS) {
    var x = this.thread.x
    var y = this.thread.y
    var z = this.thread.z
    var width = this.dimensions.x

    if (z === 0) {
      return ACC[(width * y) + x]
    } else {
      return RADIUS[(width * y) + x]
    }
  }).setDimensions([houghAcc.width, houghAcc.height, 2])

  const run = gpu.combineKernels(init, compute, thresh, merge, groupMaxima, groupResults, function (width, height, DATA, threshold) {
    var mergedAcc = init(0)
    var mergedAccRadius = init(0)

    for (var radius = 10; radius < 31; radius++) {
      var accRadius = init(radius)
      var acc = compute(DATA, radius)
      accRadius = thresh(acc, accRadius, threshold)
      acc = thresh(acc, acc, threshold)
      mergedAccRadius = merge(accRadius, mergedAccRadius)
      mergedAcc = merge(acc, mergedAcc)
    }

    mergedAcc = groupMaxima(mergedAcc)

    return groupResults(mergedAcc, mergedAccRadius)
  })

  const runResults = run(houghAcc.width, houghAcc.height, houghAcc.image.bitmap.data, threshold)

  houghAcc.accumulation = runResults[0].map(typedArray => Array.from(typedArray))
  houghAcc.accumulationRadius = runResults[1].map(typedArray => Array.from(typedArray))
}

export const normalize = houghAcc => {
  const max = getMaxAccumulation(houghAcc.accumulation, houghAcc.width, houghAcc.height)

  // TODO Execute on GPU

  // Normalise all the values
  let value
  let hexValue
  for (let x = 0; x < houghAcc.width; x++) {
    for (let y = 0; y < houghAcc.height; y++) {
      value = Math.round((houghAcc.accumulation[y][x] / max) * 255.0)

      hexValue = Jimp.rgbaToInt(value, value, value, 255)
      houghAcc.accumulation[y][x] = hexValue
    }
  }
}

export const drawMaxima = (houghAcc, circleCount) => {
  const results = []
  for (let resultIndex = 0; resultIndex < circleCount; resultIndex++) {
    results[resultIndex] = {value: 0}
  }

  for (let x = 0; x < houghAcc.width; x++) {
    for (let y = 0; y < houghAcc.height; y++) {
      const value = Jimp.intToRGBA(houghAcc.accumulation[y][x]).r

        // if its higher than lowest value add it and then sort
      if (value > results[(circleCount - 1)].value) {
        const radius = houghAcc.accumulationRadius[y][x]

          // add to bottom of array
        results[(circleCount - 1)] = {
          x: x,
          y: y,
          value: value,
          radius: radius
        }

          // shift up until its in right place
        let i = (circleCount - 2)
        while ((i >= 0) && (results[i + 1].value > results[i].value)) {
          const temp = results[i]
          results[i] = results[i + 1]
          results[i + 1] = temp
          i = i - 1
          if (i < 0) break
        }
      }
    }
  }

    // ISOLATE VALID RESULTS
  const validResults = _.filter(results, result => result.value > 0)

    // IDENTIFY SMALLEST ONE
  const smallestCircle = _.minBy(validResults, result => result.radius)
  const indexOfSmallest = _.indexOf(results, smallestCircle)
  console.log('', 'Found smallest', (circleCount - indexOfSmallest), '/', circleCount, ':', smallestCircle)
  drawCircleInYellow(houghAcc, smallestCircle.x, smallestCircle.y)

    // FIND CLOSEST FROM SMALLEST
  const squareDistance = (a, b) => (((a.x - b.x) * (a.x - b.x)) + ((a.y - b.y) * (a.y - b.y)))
  const candidatesForClosest = _.differenceWith(validResults, [smallestCircle], _.isEqual)
  const closestCircleFromSmallest = _.minBy(candidatesForClosest, result => squareDistance(result, smallestCircle))
  console.log('', 'Found closest from smallest', (circleCount - indexOfSmallest), '/', circleCount, ':', smallestCircle)
  drawCircleInGreen(houghAcc, closestCircleFromSmallest.x, closestCircleFromSmallest.y)

    // DRAW THE OTHERS
  const others = _.differenceWith(candidatesForClosest, [closestCircleFromSmallest], _.isEqual)
  others.forEach(otherCircle => {
    const indexOfOther = _.indexOf(results, otherCircle)
    console.log('', 'Found other', (circleCount - indexOfOther), '/', circleCount, ':', otherCircle)
    drawCircleInRed(houghAcc, otherCircle.x, otherCircle.y)
  })
}

const drawCircleInRed = (houghAcc, xCenter, yCenter) => {
  const red = Jimp.rgbaToInt(255, 0, 0, 255)
  drawCircle(houghAcc, xCenter, yCenter, red)
}

const drawCircleInGreen = (houghAcc, xCenter, yCenter) => {
  const green = Jimp.rgbaToInt(0, 255, 0, 255)
  drawCircle(houghAcc, xCenter, yCenter, green)
}

const drawCircleInYellow = (houghAcc, xCenter, yCenter) => {
  const yellow = Jimp.rgbaToInt(255, 255, 0, 255)
  drawCircle(houghAcc, xCenter, yCenter, yellow)
}

const drawCircle = (houghAcc, xCenter, yCenter, color) => {
    // Display circle center
  houghAcc.image.setPixelColor(color, xCenter, yCenter)

    // Display circle
  const radius = 4

  let r2 = radius * radius
  setPixel(houghAcc, color, xCenter, yCenter + radius)
  setPixel(houghAcc, color, xCenter, yCenter - radius)
  setPixel(houghAcc, color, xCenter + radius, yCenter)
  setPixel(houghAcc, color, xCenter - radius, yCenter)

  let x = 1
  let y = Math.round(Math.sqrt(r2 - 1) + 0.5)
  while (x < y) {
    setPixel(houghAcc, color, xCenter + x, yCenter + y)
    setPixel(houghAcc, color, xCenter + x, yCenter - y)
    setPixel(houghAcc, color, xCenter - x, yCenter + y)
    setPixel(houghAcc, color, xCenter - x, yCenter - y)
    setPixel(houghAcc, color, xCenter + y, yCenter + x)
    setPixel(houghAcc, color, xCenter + y, yCenter - x)
    setPixel(houghAcc, color, xCenter - y, yCenter + x)
    setPixel(houghAcc, color, xCenter - y, yCenter - x)
    x += 1
    y = Math.round(Math.sqrt(r2 - (x * x)) + 0.5)
  }
  if (x === y) {
    setPixel(houghAcc, color, xCenter + x, yCenter + y)
    setPixel(houghAcc, color, xCenter + x, yCenter - y)
    setPixel(houghAcc, color, xCenter - x, yCenter + y)
    setPixel(houghAcc, color, xCenter - x, yCenter - y)
  }
}

const setPixel = (houghAcc, color, xPos, yPos) => {
  houghAcc.image.setPixelColor(color, xPos, yPos)
}
