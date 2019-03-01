require('dotenv').config()
const moment = require('moment')
const { ekinInputBulanan, ekinGetDataKeg, ekinInputRealisasiKegiatan } = require('./ekin')
const { query, aql } = require('./db')
moment.locale('id')

const getTgl = async (num) => {
  const thn = moment().format('YYYY')
  let now = moment().add(num, 'month')
  let bln = now.format('MMMM')
  let blnNum = now.format('MM')
  const startOfMonth = now.startOf('month')
  let tglList = []
  try {
    results = await query(aql`FOR l IN liburnas FILTER l.tahun == ${thn} RETURN l`)
    liburs = results.map(result => result.date)
    while (startOfMonth.isBefore(now)) {
      if (now.day() !== 0 && liburs.indexOf(now.format('DD MMMM YYYY')) < 0) {
        tglList.push(now.format('DD'))
      }
      now = now.clone().add(-1, 'day')
    }
  } catch (err) {
    console.log(err)
  }
  return {
    tglList,
    bln,
    blnNum
  }
}



  ; (async () => {
    try {
      const { tglList, bln, blnNum } = await getTgl(0)
      const { ekin } = await ekinInputBulanan(bln, blnNum)
      if (tglList.length) {
        const { dataKeg } = await ekinGetDataKeg()
        for (let tgl of tglList) {
          console.log(tgl)
          await ekinInputRealisasiKegiatan(tgl, dataKeg)
        }
      }
      await ekin.wait(2000).end()
    } catch (err) {
      console.log(err)
    }
  })()
