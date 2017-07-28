/* globals self Jimp */

require('jimp/browser/lib/jimp')

self.addEventListener('message', function (e) {
  const imageSrc = e.data

  Jimp
    .read(imageSrc)
    .then(function (image) {
      image
      .resize(400, Jimp.AUTO)
      .getBase64(Jimp.MIME_JPEG, function (err, imageData) {
        self.postMessage(imageData)
        self.close()
      })
    })
    .catch(function (err) {
      console.error(err)
    })
})
