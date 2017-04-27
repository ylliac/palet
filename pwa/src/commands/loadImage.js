/* globals FileReader */
import 'jimp/browser/lib/jimp'

export const loadImageData = (imageData) => {
  return {
    type: 'LOAD_IMAGE',
    imageData,
    perform: (state, action) => {
      const newImage = {...state.image, imageData: action.imageData}
      return {...state, image: newImage}
    }
  }
}

export const loadImage = (image) => {
  return (dispatch) => {
    image
      .resize(400, window.Jimp.AUTO)
      .getBase64(window.Jimp.MIME_JPEG, function (err, imageData) {
        dispatch(loadImageData(imageData))
      })
  }
}

export const loadImageFromFileName = (imageFileName) => {
  return (dispatch) => {
    window.Jimp
      .read(imageFileName)
      .then(function (image) {
        dispatch(loadImage(image))
      }).catch(function (err) {
        console.error(err)
      })
  }
}

export const loadImageFromFile = (imageFile) => {
  return (dispatch) => {
    const fileReader = new FileReader()
    fileReader.onload = (event) => {
      window.Jimp
      .read(fileReader.result)
      .then(function (image) {
        dispatch(loadImage(image))
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

export const loadSampleImage = () => {
  const sampleImageFileName = '/sample.jpg'
  return loadImageFromFileName(sampleImageFileName)
}
