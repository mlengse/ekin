require('dotenv').config()
const Core = require('./core')
const config = require('./config')

const ekin = new Core(config)

module.exports = async () => {
  try {
    await ekin.init()
    for( let i in ekin.users) {
      await ekin.login( ekin.users[i] )
      await Promise.all([
        ekin.getKdSKP()
      ])
      await ekin.getKegTahun()

    }
    await ekin.close()
  }catch(e){
    console.error(e)
  }
}