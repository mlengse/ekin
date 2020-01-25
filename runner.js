if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config()
}
const Core = require('./core')
const config = require('./config')

const ekin = new Core(config)

module.exports = async () => {
  try {
    await ekin.init()
    for(let a of ekin.nums) if( a == 0 || (a == -1 && ekin.tglSkrg < 5 )) {
      for( let i in ekin.users) {
        await ekin.login( ekin.users[i] )
        if( i === 'anjang' || i === 'monic') {
          await ekin.getKdSKP()
          await ekin.getKegTahun()
          await ekin.getKegBulan({ bln: `${ekin.tgl[a].bln} ${ekin.tgl[a].thn}` })
          await ekin.fetchRealKeg({ tgl: ekin.tgl[a].tglList[0] })
          await ekin.inputHarian({ a, i })
        }
        if( a == 0 || ( a == -1 
          && (( ekin.tglSkrg < 7 ) && ( i === 'yuni' || i === 'anjang' || i === 'wagimin')) 
          || (( ekin.tglSkrg < 3 ) && ( i !== 'yuni' && i !== 'anjang' && i !== 'wagimin')))) {
            await ekin.getDataBawahan()
            let { tglLength, tglSum, blnNum, thn } = ekin.tgl[a]
            await ekin.getLaporanTamsil({blnNum, thn})
            let maxPoin = Math.round(8500*( a == 0 ? (tglLength < 20 ? (tglLength/tglSum) : 1 ) : 1 ))
            let indexNIPs = ekin.users[i].dataBawahan.map(({NIP_18}) => NIP_18 )
  
            for(tamsil of ekin.filteredTamsil){
              let existsIndex = indexNIPs.indexOf(tamsil.nip)
              let poin = Number(tamsil.poin.split('POIN').join('').trim())
              let dataBawahan = Object.assign({}, ekin.users[i].dataBawahan[existsIndex], tamsil, {
                poin,
                persen: Number(parseFloat(tamsil.kinerjaPersen)/100)
              })
              if(poin < maxPoin) {
                let acts = await ekin.getLaporanRealisasi({dataBawahan, blnNum, thn})
                acts = await ekin.getDataApprovalBawahan({acts, dataBawahan})
                while(Array.isArray(acts) && acts.length && poin < maxPoin) {
                  let act = acts.shift()
                  poin = await ekin.approve({ act, poin })
                }
  
              }
          
            }
        }

        if(!!ekin.users[i].dataBawahan.length && ekin.isApproveSKP){
          // console.log(ekin.isApproveSKP)
          for(let dataBawahan of ekin.users[i].dataBawahan){
            dataBawahan = await ekin.fetchSKPStaff({dataBawahan})
            let dataKegSKPStaff = await ekin.fetchSKPTahunanStaff({dataBawahan})
            if(dataKegSKPStaff.length) {
              for(let kegSKP of dataKegSKPStaff){
                kegSKP = await ekin.fetchKegSKP({kegSKP})
                if( !kegSKP.TARGET_KUALITAS_R ) {
                  kegSKP.TARGET_KUALITAS_R = ekin.getKualitasRand()
                  await ekin.inputKualitas({ kegSKP })                
                }
              }
              await ekin.inputPerilaku({ dataBawahan })
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