/* globals FileReader */

import 'jimp/browser/lib/jimp'
import processImageAlgorithm from '../algo'
import {loadImageData} from './loadImage'

const Jimp = window.Jimp

export const processImage = (image) => {
  return (dispatch) => {
    const resizedImage = image.resize(400, Jimp.AUTO)
    return processImageAlgorithm(resizedImage)
      .getBase64(Jimp.MIME_JPEG, function (err, imageData) {
        dispatch(loadImageData(imageData))
      })
  }
}

export const processImageFromImageData = (imageData) => {
  if (!imageData) return

  return (dispatch) => {
    let cleanedImageData = imageData

    // https://github.com/oliver-moran/jimp/issues/231
    if (imageData.startsWith('data:')) {
      cleanedImageData = imageData.split(',')[1]
    }

    // http://stackoverflow.com/a/21797381/5251198
    const binaryString = window.atob(cleanedImageData)
    const len = binaryString.length
    const bytes = new Uint8Array(len)
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }
    const arrayBuffer = bytes.buffer

    Jimp
      .read(arrayBuffer)
      .then(function (image) {
        dispatch(processImage(image))
      }).catch(function (err) {
        console.error(err)
      })
  }
}

export const processImageFromFileName = (imageFileName) => {
  return (dispatch) => {
    return Jimp
      .read(imageFileName)
      .then(function (image) {
        dispatch(processImage(image))
      })
      .catch(function (err) {
        console.error(err)
      })
  }
}

export const processImageFromFile = (imageFile) => {
  return (dispatch) => {
    const fileReader = new FileReader()
    fileReader.onload = (event) => {
      Jimp
      .read(fileReader.result)
      .then(function (image) {
        dispatch(processImage(image))
      }).catch(function (err) {
        console.error(err)
      })
    }
    fileReader.onerror = (error) => {
      console.log(error)
    }
    fileReader.readAsArrayBuffer(imageFile)
  }
}

export const processSampleImage = () => {
  const sampleImageFileName = '/sample.jpg'
  return processImageFromFileName(sampleImageFileName)
}
