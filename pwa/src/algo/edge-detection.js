import Sobel from 'sobel'

const edgeDetection = image => {
  const result = image.clone()

  const sobelData = Sobel(result.bitmap)
  const sobelImageData = sobelData.toImageData()
  result.bitmap.data = Buffer.from(sobelImageData.data)

  return result
}

export default edgeDetection
