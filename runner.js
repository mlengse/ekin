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
          await ekin.getKegBulan({ a })
          await ekin.fetchRealKeg({ a })
          await ekin.inputHarian({ a, i })
        }
        if( a == 0 || ( a == -1 
          && (( ekin.tglSkrg < 7 ) && ( i === 'yuni' || i === 'anjang' || i === 'wagimin')) 
          || (( ekin.tglSkrg < 3 ) && ( i !== 'yuni' && i !== 'anjang' && i !== 'wagimin')))) {
            await ekin.getDataBawahan()
            await ekin.getLaporanTamsil({ a })
            await ekin.approveKegStaff( { a, i })
        }

        if(!!ekin.users[i].dataBawahan.length && ekin.isApproveSKP){
          for(let dataBawahan of ekin.users[i].dataBawahan){
            let dataBawahans = await ekin.fetchSKPStaff({dataBawahan})
            if(dataBawahans.length) for( let datBaw of dataBawahans) {
              let dataKegSKPStaff = await ekin.fetchSKPTahunanStaff({dataBawahan: datBaw})
              if(dataKegSKPStaff.length) for(let kegSKP of dataKegSKPStaff){
                kegSKP = await ekin.fetchKegSKP({kegSKP})
                if( !kegSKP.TARGET_KUALITAS_R ) {
                  kegSKP.TARGET_KUALITAS_R = ekin.getKualitasRand()
                  await ekin.inputKualitas({ kegSKP })                
                }
              }
              await ekin.inputPerilaku({ dataBawahan: datBaw })
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