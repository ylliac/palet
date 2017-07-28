/* globals FileReader */
/* eslint import/no-webpack-loader-syntax: off */

import {busy} from './busy'

const LoadWorker = require('worker-loader!./load-worker.js')

export const loadImageData = (imageData) => {
  return {
    type: 'LOAD_IMAGE',
    imageData,
    perform: (state, action) => {
      const newImage = {
        ...state.image,
        imageData: action.imageData,
        processedImageData: null
      }
      return {...state, image: newImage}
    }
  }
}

const loadInWebWorker = (imageSrc) => {
  return (dispatch) => {
    dispatch(busy(true))

    var worker = new LoadWorker()
    worker.onmessage = function (e) {
      dispatch(busy(false))
      dispatch(loadImageData(e.data))
    }
    worker.postMessage(imageSrc)
  }
}

export const loadImageFromFileName = (imageFileName) => {
  return (dispatch) => {
    dispatch(loadInWebWorker(imageFileName))
  }
}

export const loadImageFromFile = (imageFile) => {
  return (dispatch) => {
    const fileReader = new FileReader()
    fileReader.onload = (event) => {
      dispatch(loadInWebWorker(fileReader.result))
    }
    fileReader.onerror = (error) => {
      console.log(error)
    }
    fileReader.readAsArrayBuffer(imageFile)
  }
}

export const loadSampleImage = () => {
  const sampleImageFileName = '/sample.jpg'
  return loadImageFromFileName(sampleImageFileName)
}
