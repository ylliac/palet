var Jimp = require('jimp')
var _ = require('lodash')

// Precompute cosinus and sinus
const cosThetaRadians = []
const sinThetaRadians = []
for (var theta = 0; theta < 360; theta++) {
  const thetaRadians = (theta * 3.14159265) / 180
  cosThetaRadians.push(Math.cos(thetaRadians))
  sinThetaRadians.push(Math.sin(thetaRadians))
}

const getMaxAccumulation = (acc, width, height) => {
    // now normalise to 255 and put in format for a pixel array
  let max = 0

    // Find max acc value
  for (let x = 0; x < width; x++) {
      // console.log('', 'Find max accumulation', x, '/', width)

    for (let y = 0; y < height; y++) {
      if (acc[x + (y * width)] > max) {
        max = acc[x + (y * width)]
      }
    }
  }

  return max
}

export const houghAccumulation = sourceImage => {
  let width = sourceImage.bitmap.width
  let height = sourceImage.bitmap.height
  let image = sourceImage.clone()

  let acc = []
  let accRadius = []
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      acc[x + (width * y)] = 0
      accRadius[x + (width * y)] = 0
    }
  }

  return {
    accumulation: acc,
    accumulationRadius: accRadius,
    width,
    height,
    image
  }
}

export const computeForRadius = (houghAcc, radius) => {
  let x0
  let y0

    // Compute accumulation matrix for each bitmap pixel
  for (let x = 0; x < houghAcc.width; x++) {
      // console.log('', 'Accumulation', x, '/', width)

    for (let y = 0; y < houghAcc.height; y++) {
        // If the pixel is black
      const pixelColorHex = houghAcc.image.getPixelColor(x, y)
      const pixelColor = Jimp.intToRGBA(pixelColorHex).r

        // DEL if ((pixelColor & 0xff) == 255) {
      if (pixelColor === 255) {
          // We compute every circle passing by this point
          // using this formula:
          // x = x0 + r * cos(theta)
          // x = y0 + r * sin(theta)

        for (let theta = 0; theta < 360; theta++) {
          x0 = Math.round(x - (radius * cosThetaRadians[theta]))
          y0 = Math.round(y - (radius * sinThetaRadians[theta]))
          if (x0 < houghAcc.width && x0 > 0 && y0 < houghAcc.height && y0 > 0) {
            houghAcc.accumulation[x0 + (y0 * houghAcc.width)] += 1
            houghAcc.accumulationRadius[x0 + (y0 * houghAcc.width)] = radius
          }
        }
      }
    }
  }
}

export const applyThreshold = (houghAcc, threshold) => {
  for (let x = 0; x < houghAcc.width; x++) {
    for (let y = 0; y < houghAcc.height; y++) {
      if (houghAcc.accumulation[x + (houghAcc.width * y)] <= threshold) {
        houghAcc.accumulation[x + (houghAcc.width * y)] = 0
        houghAcc.accumulationRadius[x + (houghAcc.width * y)] = 0
      }
    }
  }
}

export const mergeWith = (houghAcc, accToMerge) => {
  const otherAcc = accToMerge.accumulation
  const otherAccRadius = accToMerge.accumulationRadius

  for (let x = 0; x < houghAcc.width; x++) {
    for (let y = 0; y < houghAcc.height; y++) {
      houghAcc.accumulation[x + (houghAcc.width * y)] = Math.max(houghAcc.accumulation[x + (houghAcc.width * y)], otherAcc[x + (houghAcc.width * y)])
      houghAcc.accumulationRadius[x + (houghAcc.width * y)] = Math.max(houghAcc.accumulationRadius[x + (houghAcc.width * y)], otherAccRadius[x + (houghAcc.width * y)])
    }
  }
}

export const groupMaxima = houghAcc => {
  const groupedAcc = []
  for (let x = 0; x < houghAcc.width; x++) {
    for (let y = 0; y < houghAcc.height; y++) {
      const value = houghAcc.accumulation[x + (houghAcc.width * y)]
      const closeValues = [
        houghAcc.accumulation[x + 1 + (houghAcc.width * y)],
        houghAcc.accumulation[x + 1 + (houghAcc.width * (y + 1))],
        houghAcc.accumulation[x + 1 + (houghAcc.width * (y - 1))],
        houghAcc.accumulation[x - 1 + (houghAcc.width * y)],
        houghAcc.accumulation[x - 1 + (houghAcc.width * (y + 1))],
        houghAcc.accumulation[x - 1 + (houghAcc.width * (y - 1))],
        houghAcc.accumulation[x + (houghAcc.width * (y + 1))],
        houghAcc.accumulation[x + (houghAcc.width * (y - 1))]
      ]

      const isCloseToGreaterValue = _.some(closeValues, closeValue => closeValue > value)
      if (isCloseToGreaterValue) {
        groupedAcc[x + (houghAcc.width * y)] = 0
        houghAcc.accumulationRadius[x + (houghAcc.width * y)] = 0
      } else {
        groupedAcc[x + (houghAcc.width * y)] = value
      }
    }
  }

  houghAcc.accumulation = groupedAcc
}

export const normalize = houghAcc => {
  const max = getMaxAccumulation(houghAcc.accumulation, houghAcc.width, houghAcc.height)

    // Normalise all the values
  let value
  let hexValue
  for (let x = 0; x < houghAcc.width; x++) {
      // console.log('', 'Normalize accumulations', x, '/', width)

    for (let y = 0; y < houghAcc.height; y++) {
      value = Math.round((houghAcc.accumulation[x + (y * houghAcc.width)] / max) * 255.0)
        // DEL acc[x + (y * width)] = 0xff000000 | (value << 16 | value << 8 | value);
      hexValue = Jimp.rgbaToInt(value, value, value, 255)
      houghAcc.accumulation[x + (y * houghAcc.width)] = hexValue
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
      const value = Jimp.intToRGBA(houghAcc.accumulation[x + (y * houghAcc.width)]).r

        // if its higher than lowest value add it and then sort
      if (value > results[(circleCount - 1)].value) {
        const radius = houghAcc.accumulationRadius[x + (y * houghAcc.width)]

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
