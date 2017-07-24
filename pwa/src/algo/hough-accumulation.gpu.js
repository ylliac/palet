// OPTIM 0 : Les étapes de l'algo sont exécutées sur GPU et les résultats sont combinés sur CPU

const Jimp = require('jimp')
const _ = require('lodash')

const gpu = new window.GPU()

// TODO Precompute cosinus and sinus and pass them in constants ?

export const debug = houghAcc => {
  for (let x = 0; x < houghAcc.width; x++) {
    for (let y = 0; y < houghAcc.height; y++) {
      const value = Math.min(255, Jimp.intToRGBA(houghAcc.accumulation[y][x]).r)
      // if (value > 0) console.log('value', x, y, value)
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

export const houghAccumulationGPU = sourceImage => {
  let width = sourceImage.bitmap.width
  let height = sourceImage.bitmap.height
  let image = sourceImage.clone()

  const init = function () {
    return 0
  }
  const initOnGPU = gpu.createKernel(init, {
    dimensions: [width, height],
    mode: 'gpu'
  })
  const acc = initOnGPU()
  const accRadius = initOnGPU()

  return {
    accumulation: acc,
    accumulationRadius: accRadius,
    width,
    height,
    image
  }
}

export const computeForRadiusGPU = (houghAcc, radius) => {
  const run = function (DATA, radius) {
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
  }
  const runOnGPU = gpu.createKernel(run, {
    dimensions: [houghAcc.width, houghAcc.height],
    mode: 'gpu'
  })
  houghAcc.accumulation = runOnGPU(houghAcc.image.bitmap.data, radius)

  const setRadius = function (radius) {
    return radius
  }
  const setRadiusOnGPU = gpu.createKernel(setRadius, {
    dimensions: [houghAcc.width, houghAcc.height],
    mode: 'gpu'
  })
  houghAcc.accumulationRadius = setRadiusOnGPU(radius)
}

export const applyThresholdGPU = (houghAcc, threshold) => {
  const run = function (ACC, DEFAULT, threshold) {
    var result
    var x = this.thread.x
    var y = this.thread.y
    var value = ACC[y][x]
    if (value <= threshold) {
      result = 0
    } else {
      result = DEFAULT[y][x]
    }
    return result
  }

  const runOnGPU = gpu.createKernel(run, {
    dimensions: [houghAcc.width, houghAcc.height],
    mode: 'gpu'
  })
  houghAcc.accumulationRadius = runOnGPU(houghAcc.accumulation, houghAcc.accumulationRadius, threshold)
  houghAcc.accumulation = runOnGPU(houghAcc.accumulation, houghAcc.accumulation, threshold)
}

export const mergeWithGPU = (houghAcc, accToMerge) => {
  const otherAcc = accToMerge.accumulation
  const otherAccRadius = accToMerge.accumulationRadius

  // TODO ACY Il doit y avoir une erreur ici, on prend la valeur d'accumulation max et le rayon max
  // or il n'est pas garanti que le rayon max corresponde à la valeur d'accumulation max
  const run = function (ACC1, ACC2) {
    var x = this.thread.x
    var y = this.thread.y

    return Math.max(ACC1[y][x], ACC2[y][x])
  }
  const runOnGPU = gpu.createKernel(run, {
    dimensions: [houghAcc.image.bitmap.width, houghAcc.image.bitmap.height],
    mode: 'gpu'
  })
  houghAcc.accumulation = runOnGPU(houghAcc.accumulation, otherAcc)
  houghAcc.accumulationRadius = runOnGPU(houghAcc.accumulationRadius, otherAccRadius)
}

export const groupMaximaGPU = houghAcc => {
  const run = function (ACC) {
    var x = this.thread.x
    var y = this.thread.y

    var value = ACC[y][x]

    if (
      (ACC[y][x + 1]) > value ||
      (ACC[y + 1][x + 1]) > value ||
      (ACC[y - 1][x + 1]) > value ||
      (ACC[y][x - 1]) > value ||
      (ACC[y + 1][x - 1]) > value ||
      (ACC[y - 1][x - 1]) > value ||
      (ACC[y + 1][x]) > value ||
      (ACC[y - 1][x]) > value
    ) {
      return 0
    } else {
      return value
    }
  }
  const runOnGPU = gpu.createKernel(run, {
    dimensions: [houghAcc.image.bitmap.width, houghAcc.image.bitmap.height],
    mode: 'gpu'
  })
  houghAcc.accumulation = runOnGPU(houghAcc.accumulation)
}

export const normalize = houghAcc => {
  const max = getMaxAccumulation(houghAcc.accumulation, houghAcc.width, houghAcc.height)

  // TODO Execute on GPU

    // Normalise all the values
  let value
  let hexValue
  for (let x = 0; x < houghAcc.width; x++) {
      // console.log('', 'Normalize accumulations', x, '/', width)

    for (let y = 0; y < houghAcc.height; y++) {
      // console.log('+1', x, y, houghAcc.accumulation[y][x])
      value = Math.round((houghAcc.accumulation[y][x] / max) * 255.0)

        // DEL acc[x + (y * width)] = 0xff000000 | (value << 16 | value << 8 | value);
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
