if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config()
}
const Core = require('./core')
const config = require('./config')

const ekin = new Core(config)

module.exports = async isPM2 => {
  try {
    await ekin.init()
    // if(a === -1) {
    for( let i in ekin.users) {
      for(let a of ekin.nums) {
        // console.log(ekin.users[i].input)
        if( (a === 0 || (a === -1 && ekin.tglSkrg < 3 )) && ekin.users[i].input) {
          await ekin.login( ekin.users[i] )
          await ekin.getKdSKP()
          await ekin.getKegTahun()
          await ekin.getKegBulan({ a })
          await ekin.fetchRealKeg({ a })
          await ekin.inputHarian({ a, i })
        }
        if( ekin.users[i].kabeh || a === 0 || ( a === -1 
          && ((( ekin.tglSkrg < 6 ) && !ekin.users[i].early)
            || (( ekin.tglSkrg < 3 ) && ekin.users[i].early))
          )) {
            await ekin.login( ekin.users[i] )
            await ekin.fetchDataBulan()
            await ekin.getDataBawahan()
            if(!ekin.users[i].kabeh){
              await ekin.getLaporanTamsil({ a })
            }
            await ekin.approveKegStaff( { a, i })
          }

        // if(i !== 'nur' && !!ekin.users[i].dataBawahan.length && ekin.isApproveSKP){
        //   await ekin.approveSKPStaff({ i })
        // }
      
      }
    }
    await ekin.close(isPM2)
    console.log(`process done: ${new Date()}`)
  }catch(e){
    ekin.close(isPM2)
    console.error(e)
    console.error(`process error: ${new Date()}`)
  }
}