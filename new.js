require('dotenv').config()
const moment = require('moment')
const jftlists = require('./ekinList')
const jfulists = require('./jfulist')

const usernameKA = process.env.EKIN_USERNAME_KA
const passwordKA = process.env.EKIN_PASSWORD_KA

const { 
  ekinInputBulanan, 
  ekinGetDataKeg, 
  ekinInputRealisasiKegiatan, 
  //ekinLoginKepala,
  ekinLoginKA,
  ekinLoginTU,
  approving 
} = require('./ekin')
moment.locale('id')

const getTgl = async (num) => {
  let now = moment()
  let bln = now.clone().add(num, 'month').format('MMMM')
  let blnNum = now.clone().add(num, 'month').format('MM')
  const startOfMonth = now.clone().add(num, 'month').startOf('month')
  let endOfMonth = now.clone().add(num, 'month').endOf('month')
  let tglList = []
  let tglLength = 0
  if (endOfMonth.isBefore(now)){
    now = endOfMonth
  }
  try {
    while (startOfMonth.isBefore(now)) {
      if (now.day() !== 0) {
        tglList.push(now.format('DD MM YYYY'))
      }
      now = now.clone().add(-1, 'day')
    }
    now = endOfMonth
    while (startOfMonth.isBefore(now)) {
      if (now.day() !== 0) {
        tglLength++
      }
      now = now.clone().add(-1, 'day')
    }
    return {
      tglList,
      tglLength,
      bln,
      blnNum
    }
  } catch (err) {
    console.log(err)
  }
}

; 

module.exports = async () => {
  try {

    for (a of [ 0, /*-1, -2, -3, -4*/]) {

      const { tglList, tglLength, bln, blnNum } = await getTgl(a)

      let instance = await ekinInputBulanan(bln, blnNum, usernameKA, passwordKA)

      if (tglList.length) {
        const { dataKeg } = await ekinGetDataKeg( { ekin: instance.ekin } );
        console.log(dataKeg.length);
        for (let tgl of tglList) {
          await ekinInputRealisasiKegiatan({ ekin: instance.ekin, tgl, tglLength, dataKeg })
        }
      }

      await instance.ekin.end()

      for(let list of await jfulists()) {
        console.log(list.NIP)

        let username = list.NIP

        let blnOnly = moment(bln, 'MMMM YYYY').format('MMMM')

        let { ekin } = await ekinLoginTU()

        console.log(blnOnly)

        await approving(ekin, username, blnOnly)
        await ekin.end()

      }

      for(let list of await jftlists()) {
        console.log(list.NIP)

        let username = list.NIP

        let blnOnly = moment(bln, 'MMMM YYYY').format('MMMM')

        let { ekin } = await ekinLoginKA()

        console.log(blnOnly)

        await approving(ekin, username, blnOnly)
        await ekin.end()

      }

    }
  } catch (err) {
    console.log(err)
  }
}
