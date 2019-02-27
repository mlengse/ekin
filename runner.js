require('dotenv').config()
const moment = require('moment')
const { ekinGetDataKeg } = require('./ekin')
const { query, aql } = require('./db')
moment.locale('id')

const tglList = async () => {
  const thn = moment().format('YYYY')
  let now = moment()
  const startOfMonth = moment().startOf('month')
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
  return tglList
}

;(async () => {
  try {
    const [tgls, { ekin, dataKeg }] = await Promise.all([tglList(), ekinGetDataKeg()])
    for (let tgl of tgls) {
      await ekin.click('#TGL_REALISASI')
        .wait('#TGL_REALISASI > .bfh-datepicker-calendar > table > tbody td[data-day="' + tgl + '"]')
        .click('#TGL_REALISASI > .bfh-datepicker-calendar > table > tbody td[data-day="' + tgl + '"]')

      for (let { act, bln, keg, jml } of dataKeg) {
        let jmlInp = (jml/tgls.length).toFixed()
        await ekin.evaluate((act) => {
          eval(act)
          window.confirm = function (_, __) {
            return true
          }
          buat_kode_d_realisasi_kegiatan()
        }, act)
        if (keg.includes('catatan medik')) {
          await ekin.type('#KD_AKTIVITAS', 'Mencatat')
        } else {
          await ekin.type('#KD_AKTIVITAS', 'Memeriksa')
        }
        await ekin
          .insert('#NM_KEGIATAN', keg)
          .insert('#KUANTITAS', jmlInp)
        /*
        await ekin.click('#JAM_MULAI')
          .wait('#JAM_MULAI > div.bfh-timepicker-popover > table > tbody > tr > td.hour > div > input')
          .insert('#JAM_MULAI > div.bfh-timepicker-popover > table > tbody > tr > td.hour > div > input', )
        */
        await ekin.evaluate(() => simpan())
        await ekin.wait(2000)
        console.log(tgl, bln, keg, jmlInp)
        
      }

    }
    await ekin.end()
  } catch (err) {
    console.log(err)
  }
})()
