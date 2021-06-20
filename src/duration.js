const load = require('audio-loader')
 
async function getDuration(file) {
  return await new Promise((resolve, reject) => {
    load(file).then(function (res) {
      // get audio duration
      var duration = res.duration
      resolve(duration)
    })
  })
}
module.exports = getDuration