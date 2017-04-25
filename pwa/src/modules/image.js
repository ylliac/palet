import 'jimp/browser/lib/jimp'
import processImage from '../algo'

const IMAGE_LOADED = 'IMAGE_LOADED'

const imageLoaded = (imageData) => {
  return {
    type: IMAGE_LOADED,
    imageData
  }
}

const processImageFile = (imageFileName) => {
  return (dispatch) => {
    window.Jimp
      .read(imageFileName)
      .then(function (image) {
        var resizedImage = image.resize(400, window.Jimp.AUTO)
        return processImage(resizedImage).getBase64(window.Jimp.MIME_JPEG, function (err, imageData) {
          dispatch(imageLoaded(imageData))
        })
      }).catch(function (err) {
        console.error(err)
      })
  }
}

export const PROCESS_SAMPLE_IMAGE = 'PROCESS_SAMPLE_IMAGE'

export const processSampleImage = () => {
  const sampleImageFileName = '/sample.jpg'
  return processImageFile(sampleImageFileName)
}

export default function reducer (state = {}, action = {}) {
  switch (action.type) {
    case IMAGE_LOADED:
      return {...state, imageData: action.imageData}
    default: return state
  }
}
