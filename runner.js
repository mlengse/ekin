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
        await ekin.fetchRealKeg({ tgl: ekin.tgl[a].tglList[0] })
        for(let p in ekin.plans) {
          let plan = ekin.plans[p]
          let bln = Number(ekin.tgl[a].blnNum)
          let kegThn = ekin.kegTahun.filter(({nmKeg}) => nmKeg === plan.kegiatan)
          let kegBln = ekin.kegBulan.filter(({nmKeg}) => nmKeg === plan.kegiatan)
          let maxPoin = Math.round(8500*( a == 0 ? (ekin.tgl[a].tglLength < 20 ? (ekin.tgl[a].tglLength/ekin.tgl[a].tglSum) : 1 ) : 1 ))

          if(plan[bln] && kegThn.length ) {
            if(!kegBln.length) {
              await ekin.inputBln({
                act: kegThn[0].act,
                blnNum: ekin.tgl[a].blnNum,
                kuant: plan[bln]
              })
              await ekin.getKegBulan({ 
                bln: `${ekin.tgl[a].bln} ${ekin.tgl[a].thn}` 
              })
              kegBln = ekin.kegBulan.filter(({nmKeg}) => nmKeg === plan.kegiatan)
            }
            if(kegBln[0].tgtKuant > 1 ) {

              for(let tgl of ekin.tgl[a].tglList) {
                let actvs = ekin.getAktivitas().filter( ({NM_AKTIVITAS}) => NM_AKTIVITAS.toLowerCase() === plan.aktivitas.toLowerCase())[0]
                let keg = Object.assign({}, kegBln[0], actvs, {
                  nip: ekin.users[i].username,
                  tgl, 
                  tglLength: ekin.tgl[a].tglLength, 
                  jmlInp: Math.ceil(kegBln[0].tgtKuant / ekin.tgl[a].tglLength).toFixed()
                })
                let kegExist = ekin.realKeg.filter( ({tgl, nmKeg}) => tgl === keg.tgl && keg.nmKeg === nmKeg)
  
                if( ekin.totalPoin < maxPoin && !kegExist.length){
                  // console.log(ekin.totalPoin, maxPoin)
                  // console.log()
                  // console.log(keg)
                  await ekin.inputKegiatan({ 
                    keg
                  })
                }
              }
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