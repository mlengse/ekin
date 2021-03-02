if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config()
}
const Core = require('./core')
const config = require('./config')
const ekin = new Core(config)

if (!('toJSON' in Error.prototype))
Object.defineProperty(Error.prototype, 'toJSON', {
    value: function () {
        var alt = {};

        Object.getOwnPropertyNames(this).forEach(function (key) {
            alt[key] = this[key];
        }, this);

        return alt;
    },
    configurable: true,
    writable: true
});

const ekinProcess = async ekin => {
  // console.log(ekin.usersArr)
  try{
  // if(a === -1) {
    while(ekin.usersArr.length) {
      let i = ekin.usersArr[0].nama
      // console.log(ekin.users[i])
    // for( let i in ekin.users) {
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
            // if(!ekin.users[i].kabeh){
            await ekin.getLaporanTamsil({ a })
            // }

            await ekin.approveKegStaff({ a, i })
          }
      }
      if((ekin.users[i].dataBawahan && !!ekin.users[i].dataBawahan.length) && ekin.isApproveSKP && ekin.users[i].skp){
        await ekin.approveSKPStaff({ i })
      }
      ekin.usersArr.shift()
    }
  
  }catch(e){
    console.error(JSON.stringify(e))
    console.error(`process error: ${new Date()}`)
    await ekinProcess(ekin)
  }

}

module.exports = async isPM2 => {
  await ekin.init()
  ekin.usersArr = Object.keys(ekin.users).map( i => ekin.users[i])
  await ekinProcess(ekin)
  await ekin.close(isPM2)
}