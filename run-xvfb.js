const start = require('./start')
const ekin = require('./ekin')

module.exports = (isPM2) => {
  if(process.platform !== 'win32') {
    start('runner')
  } else {
    ;(async() => {
      await ekin(isPM2)
    })()
  }
}
