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
        await Promise.all([
          ekin.getKdSKP()
        ])
        await Promise.all([
          ekin.getKegTahun(),
          ekin.getKegBulan({ bln: `${ekin.tgl[a].bln} ${ekin.tgl[a].thn}` })
        ])
        for(let p in ekin.plans) {
          let plan = ekin.plans[p]
          let bln = Number(ekin.tgl[a].blnNum)
          let kegThn = ekin.kegTahun.filter(({nmKeg}) => nmKeg === plan.kegiatan)
          let kegBln = ekin.kegBulan.filter(({nmKeg}) => nmKeg === plan.kegiatan)
          // console.log(kegThn)
          if(plan[bln] && kegThn.length ) {
            if(!kegBln.length) {
              // console.log(kegThn[0].act)
              await ekin.inputBln({
                act: kegThn[0].act,
                blnNum: ekin.tgl[a].blnNum,
                kuant: plan[bln]
              })
              // console.log(Object.assign({}, kegThn[0], plan))
            }
            // console.log(plan)
            // console.log(ekin.plans[p].kegiatan, ekin.plans[p][Number(ekin.tgl[a].blnNum)])
          }
        }
        // console.log(ekin.kegTahun)

      }
    }
    await ekin.close()
  }catch(e){
    console.error(e)
    await ekin.close()

  }
}