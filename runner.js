require('dotenv').config()
const Core = require('./core')
const config = require('./config')

const ekin = new Core(config)

module.exports = async () => {
  try {
    await ekin.init()
    for(let a of ekin.nums) if( a == 0 || (a == -1 && ekin.tglSkrg < 5 )) {
      for( let i in ekin.users) {
        await ekin.login( ekin.users[i] )
        await ekin.getKdSKP()
        await ekin.getKegTahun()
        await ekin.getKegBulan({ bln: `${ekin.tgl[a].bln} ${ekin.tgl[a].thn}` })
        for(let p in ekin.plans) {
          let plan = ekin.plans[p]
          let bln = Number(ekin.tgl[a].blnNum)
          let kegThn = ekin.kegTahun.filter(({nmKeg}) => nmKeg === plan.kegiatan)
          let kegBln = ekin.kegBulan.filter(({nmKeg}) => nmKeg === plan.kegiatan)
          if(plan[bln] && kegThn.length ) {
            if(!kegBln.length) {
              await ekin.inputBln({
                act: kegThn[0].act,
                blnNum: ekin.tgl[a].blnNum,
                kuant: plan[bln]
              })
            }
          }
        }
      }
    }
    await ekin.close()
  }catch(e){
    console.error(e)
    await ekin.close()
  }
}