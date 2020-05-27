const start = require('./start')
const ekin = require('./ekin')

module.exports = () => {
  if(process.platform !== 'win32') {
    start('runner')
  } else {
    ;(async() => {
      await ekin()
    })()
  }
}
