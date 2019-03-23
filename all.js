require('dotenv').config()
const moment = require('moment')
const lists = require('./ekinList')
const { ekinInputBulanan, ekinGetDataKeg, ekinInputRealisasiKegiatan, approving } = require('./ekin')
const { loginPresensi, searchTglAndNIP } = require('./presensi')
const { query, aql } = require('./db')
moment.locale('id')

const getTgl = async (num) => {
  const thn = moment().format('YYYY')
  let now = moment().add(num, 'month')
  let bln = now.format('MMMM')
  let blnNum = now.format('MM')
  const startOfMonth = now.clone().startOf('month')
  let endOfMonth = now.clone().endOf('month')
  let tglList = []
  let tglLength = 0
  try {
    results = await query(aql`FOR l IN liburnas FILTER l.tahun == ${thn} RETURN l`)
    liburs = results.map(result => result.date)
    while (startOfMonth.isBefore(now)) {
      if (now.day() !== 0 && liburs.indexOf(now.format('D MMMM YYYY')) < 0) {
        tglList.push(now.format('DD'))
      }
      now = now.clone().add(-1, 'day')
    }
    now = endOfMonth
    while (startOfMonth.isBefore(now)) {
      if (now.day() !== 0 && liburs.indexOf(now.format('DD MMMM YYYY')) < 0) {
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



module.exports = async () => {
  try {

    for(let list of await lists()) {
      console.log(list.NIP)
      console.log(list.Nama)

      let username = list.NIP
      let password = list.NIP
      const { tglList, tglLength, bln, blnNum } = await getTgl(0)
      
      let { presensi } = await loginPresensi()
      let { ekin } = await ekinInputBulanan(bln, blnNum, username, password)

      if (tglList.length) {
        let tglPresensi = tglList.slice(1, 5)
        const { dataKeg } = await ekinGetDataKeg({ ekin });
        console.log(dataKeg.length);
        for (let tgl of tglPresensi) {
          await searchTglAndNIP(presensi, tgl, bln, list)
          await ekinInputRealisasiKegiatan({ ekin, tgl, tglLength, dataKeg })

        }
      }
      
      await ekin.end();
      await presensi.end()

      let blnOnly = moment(bln, 'MMMM YYYY').format('MMMM')
      //await approving(username, blnOnly)

    }
  } catch (err) {
    console.log(err)
  }
}