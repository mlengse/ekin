require('dotenv').config()
const Core = require('./core')
const config = require('./config')

const ekin = new Core(config)

module.exports = async () => {
  try {
    await ekin.init()
    for(let a of ekin.nums) if( a == 0 || (a == -1 && ekin.tglSkrg < 5 )) {
      for( let i in ekin.users) {
        // await ekin.login( ekin.users[i] )
        // await Promise.all([
        //   ekin.getKdSKP()
        // ])
        // await ekin.getKegTahun()
        for(let plan in ekin.plans) {
          // console.log(Number(ekin.tgl[a].blnNum))
          // console.log(ekin.plans[plan])
          if(ekin.plans[plan][Number(ekin.tgl[a].blnNum)]) {
            console.log(ekin.plans[plan].kegiatan, ekin.plans[plan][Number(ekin.tgl[a].blnNum)])
          }
        }
        // console.log(ekin.kegTahun)

      }
    }
    await ekin.close()
  }catch(e){
    console.error(e)
  }
}