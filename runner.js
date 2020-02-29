if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config()
}
const Core = require('./core')
const config = require('./config')

const ekin = new Core(config)

module.exports = async () => {
  try {
    await ekin.init()
    // if(a === -1) {
    for( let i in ekin.users) {
      for(let a of ekin.nums) {//if( a == 0 || (a == -1 && ekin.tglSkrg < 5 )) {
        if( a === 0 && (i === 'anjang' || i === 'monic')) {
          await ekin.login( ekin.users[i] )
          await ekin.getKdSKP()
          await ekin.getKegTahun()
          await ekin.getKegBulan({ a })
          await ekin.fetchRealKeg({ a })
          await ekin.inputHarian({ a, i })
        }
        if( a == 0 || ( a == -1 
          && ((( ekin.tglSkrg < 7 ) && ( i === 'yuni' || i === 'anjang' || i === 'wagimin')) 
            || (( ekin.tglSkrg < 3 ) && ( i !== 'yuni' && i !== 'anjang' && i !== 'wagimin')))
          )) {
            await ekin.login( ekin.users[i] )
            await ekin.getDataBawahan()
            await ekin.getLaporanTamsil({ a })
            await ekin.approveKegStaff( { a, i })
          }

          // if(i !== 'nur' && !!ekin.users[i].dataBawahan.length && ekin.isApproveSKP){
          //   await ekin.approveSKPStaff({ i })
          // }
      
      }
    }
    await ekin.close()
    console.log(`process done: ${new Date()}`)
  }catch(e){
    ekin.close()
    console.error(e)
    console.error(`process error: ${new Date()}`)
  }
}