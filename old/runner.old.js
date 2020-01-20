require('dotenv').config()
const moment = require('moment')
const lists = require('./ekinList')
const { ekinInputBulanan, ekinGetDataKeg, ekinInputRealisasiKegiatan, approving } = require('./ekin')
const { loginPresensi, searchTglAndNIP } = require('./presensi')
// const { query, aql } = require('./db')
moment.locale('id')

// const getTgl = async (num) => {
//   const thn = moment().format('YYYY')
//   let now = moment()
//   let bln = now.clone().add(num, 'month').format('MMMM')
//   let blnNum = now.clone().add(num, 'month').format('MM')
//   const startOfMonth = now.clone().add(num, 'month').startOf('month')
//   let endOfMonth = now.clone().add(num, 'month').endOf('month')
//   let tglList = []
//   let tglLength = 0
//   if (endOfMonth.isBefore(now)){
//     now = endOfMonth
//   }
//   try {
//     results = await query(aql`FOR l IN liburnas FILTER l.tahun == ${thn} RETURN l`)
//     liburs = results.map(result => result.date)
//     while (startOfMonth.isBefore(now)) {
//       if (now.day() !== 0 && liburs.indexOf(now.format('D MMMM YYYY')) < 0) {
//         tglList.push(now.format('DD MM YYYY'))
//       }
//       now = now.clone().add(-1, 'day')
//     }
//     now = endOfMonth
//     while (startOfMonth.isBefore(now)) {
//       if (now.day() !== 0 && liburs.indexOf(now.format('DD MMMM YYYY')) < 0) {
//         tglLength++
//       }
//       now = now.clone().add(-1, 'day')
//     }
//     return {
//       tglList,
//       tglLength,
//       bln,
//       blnNum
//     }
//   } catch (err) {
//     console.log(err)
//   }
// }

; (async () => {
  try {

    for (a of [0/*, -1, -2, -3, -4*/]) {
      for(let list of await lists()) {
        // console.log(list.NIP)
        // console.log(list.Nama)
        //console.log(list.ranap)
        // let ranap = JSON.parse(list.ranap)

        // let username = list.NIP
        // let password = list.pwd

        // const { tglList, tglLength, bln, blnNum } = await getTgl(a)
        
        // let [{ presensi }, { ekin }] = await Promise.all([
        //   // ranap ? loginPresensi() : ({ presensi: null}),
        //   ekinInputBulanan(bln, blnNum, username, password)
        // ])

        if (tglList.length) {
          //console.log(tglList)
          //let tglPresensi = tglList.slice(1, 5)
          //console.log(tglPresensi)
          // const { dataKeg } = await ekinGetDataKeg({ ekin });
          // console.log(dataKeg.length);
          for (let tgl of tglList/*tglPresensi*/) {
            //console.log(tgl)
            // if(presensi){
            //   await searchTglAndNIP(presensi, tgl, bln, list)
            // }
            await ekinInputRealisasiKegiatan({ ekin, tgl, tglLength, dataKeg })
          }
        }

        // if(presensi) {
        //   await presensi.end()
        // }

        // await ekin.end()

        // console.log(Number(tglList[tglList.length - 1].split(' ')[0]))
      //   if (Number(tglList[tglList.length - 1].split(' ')[0]) > 26) {
      //     let blnOnly = moment(bln, 'MMMM YYYY').format('MMMM')
      //  //   await approving(username, blnOnly)
      //   }

      }


    }
  } catch (err) {
    console.log(err)
  }
})()
