require('dotenv').config()
// const { getEkin } = require('./nmrunner')
const moment = require('moment')
const { 
  tableKegEval, 
  // saveInputBulanan, 
  // delInputBulanan,
  // buatKodeInputBln, 
  saveRealisasiKegiatan, 
  hapusRealisasiKegiatan, 
  buatKodeRealisasiKeg 
} = require('./browser')
// const url = process.env.EKIN_URL
// const usernameBos = process.env.EKIN_USERNAME_BOS
// const passwordBos = process.env.EKIN_PASSWORD_BOS
// const usernameKA = process.env.EKIN_USERNAME_KA
// const passwordKA = process.env.EKIN_PASSWORD_KA
// const usernameTU = process.env.EKIN_USERNAME_TU
// const passwordTU = process.env.EKIN_PASSWORD_TU
// const loginButton = process.env.LOGIN_BUTTON
// const rencanaBulanan = process.env.RENCANA_BULANAN_SELECTOR
// const rencanaBulananUrl = process.env.RENCANA_BULANAN_URL
// const realisasiKegiatan = process.env.REALISASI_KEGIATAN_SELECTOR
// const realisasiKegiatanUrl = process.env.REALISASI_KEGIATAN_URL
// const tableId = process.env.TABLE_ID
moment.locale('id')

// const ekinGetDataKeg = async ({ ekin }) => {
//   try {
//     await ekin
//       .wait(realisasiKegiatan)
//       .goto(url + realisasiKegiatanUrl)
//       .wait(tableId)
//       .select("#tabel_d_kegiatan_bulan_length > label > select", "100");
//     let dataKeg
//     while(!dataKeg) {
//       dataKeg = await ekin.evaluate(tableKegEval, tableId);
//     }
    
//     return {
//       ekin, dataKeg
//     }
//   } catch (err) {
//     console.log(err)
//   }

// }

// const ekinLogin = async (user, passw) => {
//   if (!user) {
//     user = username
//     passw = password
//   }
//   let ekin = getEkin()
//   try {
//     await ekin.goto(url)
//     let needLogin = await ekin.exists('#USERNAME')
//     if (!needLogin) {
//       let text = await ekin.evaluate(() => document.getElementById('header').textContent)
//       let trueLogin = text.includes(user)
//       if (!trueLogin) {
//         await ekin.evaluate(() => {
//           window.confirm = () => true
//           logout()
//         })
//         await ekin.goto(url)
//       }
//     }
//     needLogin = await ekin.exists('#USERNAME')
//     if (needLogin) {
//       await ekin.wait('#USERNAME')
//         .insert('#USERNAME', user)
//         .insert('#PASSWORD', passw)
//         .click(loginButton)
//     }
//     return { ekin }
//   } catch (err) {
//     console.log(err)
//   }

// }

// const ekinLoginKepala = async () => {
//   try {
//     let { ekin } = await ekinLogin(usernameBos, passwordBos)
//     return { ekin }
//   } catch (err) {
//     console.log(err)
//   }

// }


// const ekinLoginKA = async () => {
//   try {
//     let { ekin } = await ekinLogin(usernameKA, passwordKA)
//     return { ekin }
//   } catch (err) {
//     console.log(err)
//   }

// }

// const ekinLoginTU = async () => {
//   try {
//     let { ekin } = await ekinLogin(usernameTU, passwordTU)
//     return { ekin }
//   } catch (err) {
//     console.log(err)
//   }

// }


// const approving = async (ekin, username, bln) => {
//   try {
//     let links = ['d_approve_realisasi_kegiatan', 'd_approve_kegiatan_tambahan']
//     for(link of links) {
//       console.log(link)
//       await ekin
//       .goto(`${url}${link}`)
//       .wait('#tabel_bawahan')
//       .evaluate((username) => klik_data_pegawai_bawahan(username), username)

//       let nip = ''
//       while (nip !== username) {
//         nip = await ekin.evaluate(() => document.getElementById('nip_pegawai').textContent)
//       }

//       let acts = []

//       let start = new Date()
//       let end = new Date()

//       while(!acts.length && end - start < 100000){
//         //await ekin.wait(5000)
//         acts = await ekin
//           .evaluate(link => {
//             let table = document.getElementById(`tabel_${link}`)
//             let rows = table.querySelectorAll('tr')
//             let acts = []
//             for (row of rows) {
//               let act = row.getAttribute('ondblclick')
//               if(act){
//                 act = act.split('\n').map(e=>e.trim()).join('')
//                 acts.push(act)
//               }
//             }
//             return acts
//           }, link)
//         end = new Date()
//         //console.log(acts)
//       }

//       console.log('execution time:', end-start, 'ms')

//       if(bln.toLowerCase() === 'november') {
//         bln = 'nopember'
//       }

//       acts = await ekin
//       .type(`#tabel_${link}_filter > label > input`, 'Belum ' + bln.toUpperCase())
//       .select(`#tabel_${link}_length > label > select`, '100')
//       .evaluate(link => {
//         let table = document.getElementById(`tabel_${link}`)
//         let rows = table.querySelectorAll('tr')
//         let acts = []
//         for (row of rows) {
//           let act = row.getAttribute('ondblclick')
//           if(act){
//             act = act.split('\n').map(e=>e.trim()).join('')
//             acts.push(act)
//           }
//         }
//         return acts
//       }, link)

//       for (act of acts) {
// //        act = act.split('\n').map(e=>e.trim()).join('')
//         console.log(act)
//         await ekin
//           .evaluate(act => eval(act), act)
//           .wait(1000)
//           .evaluate(() => simpan())
//           .wait(1000)
//       }
  
//     }
//     //return { ekin }
//   } catch (err) {
//     console.log(err)
//   }

// }

const ekinInputRealisasiKegiatan = async ({ ekin, tgl, tglLength, dataKeg }) => {
  try {
    let bbln = Number(moment(tgl, 'DD MM YYYY').format('M'))
    let ttgl = moment(tgl, 'DD MM YYYY').format('D')
    let tglNum = Number(ttgl)
    //console.log(bbln)
    //console.log(ttgl)
    //console.log(tgl)
    let bln = await ekin
      .click('#TGL_REALISASI > div.input-group.bfh-datepicker-toggle > span')
      .wait('#TGL_REALISASI > div.bfh-datepicker-calendar > table > thead > tr > th > a.previous')
      .wait('#TGL_REALISASI > div.bfh-datepicker-calendar > table > thead > tr > th.month > span')
      .evaluate(() => document.querySelector('#TGL_REALISASI > div.bfh-datepicker-calendar > table > thead > tr > th.month > span').textContent)
    while ( Number(moment(bln, 'MMMM').format('M')) !== bbln){
      if (Number(moment(bln, 'MMMM').format('M')) > bbln){
        await ekin.click('#TGL_REALISASI > div.bfh-datepicker-calendar > table > thead > tr > th > a.previous')
        bln = await ekin.evaluate(() => document.querySelector('#TGL_REALISASI > div.bfh-datepicker-calendar > table > thead > tr > th.month > span').textContent)
        //bbln++
      }
      if (Number(moment(bln, 'MMMM').format('M')) < bbln) {
        await ekin.click('#TGL_REALISASI > div.bfh-datepicker-calendar > table > thead > tr > th > a.next')
        bln = await ekin.evaluate(() => document.querySelector('#TGL_REALISASI > div.bfh-datepicker-calendar > table > thead > tr > th.month > span').textContent)
        //bbln--
      }
    }
    
    await ekin
      .click('#TGL_REALISASI > div.input-group.bfh-datepicker-toggle > span')
      .wait('#TGL_REALISASI > div.bfh-datepicker-calendar > table > tbody td[data-day="' + tglNum + '"]')
      .click('#TGL_REALISASI > div.bfh-datepicker-calendar > table > tbody td[data-day="' + tglNum + '"]')

    for (let { act, bln, keg, jml } of dataKeg) {

      if( !keg.includes('inap')) {
        await ekin/*.wait(2000)*/.wait('#TOTAL_POIN')
        let totalPoin
        while(totalPoin === undefined || totalPoin === null || totalPoin === false) {
          totalPoin = await ekin.evaluate(() => document.getElementById('TOTAL_POIN').textContent)
          totalPoin = totalPoin.split(":")[1]
          if(totalPoin){
            totalPoin = Number(totalPoin.split(' ')[1])
          } else {
            totalPoin = false
          }
        }
  
        if(totalPoin > 8500) {
          console.log("total poin:", totalPoin, 'poin tercapai. selanjutnya silahkan input manual')
          break
        } else {
          let tglSearch = moment(`${ttgl} ${bbln}`, 'D M').format('DD/MM/YYYY')
          let tglKeg = `${tglSearch} ${keg}`
  
          console.log(tglKeg)
  
          //let searchArr = tglKeg.split('')
          //let last = searchArr.pop()
          //let search = searchArr.join('')
  
          let tableRealisasiKeg = await ekin
            .wait(1000)
            .select('#tabel_d_realisasi_kegiatan_length > label > select', '100')
            .insert('#tabel_d_realisasi_kegiatan_filter > label > input', '')
            //.insert('#tabel_d_realisasi_kegiatan_filter > label > input', search)
            .insert('#tabel_d_realisasi_kegiatan_filter > label > input', tglKeg)
            .type('#tabel_d_realisasi_kegiatan_filter > label > input', '')
            .wait(1000)
            .evaluate(tableKegEval, '#tabel_d_realisasi_kegiatan')
  
  
          let jmlInp = 0
          if (jml > 1) {
            jmlInp = Math.ceil(jml / tglLength).toFixed()
            console.log('jml', jml)
            console.log('tgl length', tglLength)
            console.log('jml inp', jmlInp)
          }
  
          let kdAktivitas
          if (['catatan medik', 'catatan', 'dokumentasi', 'dukumentasi'].filter(e => keg.toLowerCase().includes(e.toLowerCase())).length) {
            kdAktivitas = 'Mencatat'
          } else if (['medik', 'konsul', 'pasien', 'konsultasi gizi'].filter(e => keg.toLowerCase().includes(e.toLowerCase())).length) {
            kdAktivitas = 'Memeriksa'
          } else if (['anggung jawab', 'laksana program'].filter(e => keg.toLowerCase().includes(e.toLowerCase())).length) {
            kdAktivitas = 'Mengkoordinasikan'
          } else if (['Menyiapkan bahan'].filter(e => keg.toLowerCase().includes(e.toLowerCase())).length) {
            kdAktivitas = 'Menyiapkan data/dokumen/laporan'
          } else if (['rencana'].filter(e => keg.toLowerCase().includes(e.toLowerCase())).length) {
            kdAktivitas = 'Merencanakan'
          } else if (['menyusun instrumen'].filter(e => keg.toLowerCase().includes(e.toLowerCase())).length) {
            kdAktivitas = 'Menyusun data/bahan'
          } else if (['umpulkan data'].filter(e => keg.toLowerCase().includes(e.toLowerCase())).length) {
            kdAktivitas = 'Mengumpulkan Bahan/Data'
          } else if (['mengolah data', 'analisis data'].filter(e => keg.toLowerCase().includes(e.toLowerCase())).length) {
            kdAktivitas = 'Mengolah Data'
          } else if (['membuat rancangan'].filter(e => keg.toLowerCase().includes(e.toLowerCase())).length) {
            kdAktivitas = 'Membuat Rancangan'
          } else if (['mengajar', 'melatih', 'memberikan pelatihan', 'advokasi', 'penyuluhan'].filter(e => keg.toLowerCase().includes(e.toLowerCase())).length) {
            kdAktivitas = 'Membimbing'
          } else {
            console.log(keg)
            console.log('kode aktivitas belum ditentukan')
          }
  
          if( tableRealisasiKeg.length && tableRealisasiKeg[0].act) {
            console.log('sudah diinput')
            if (tableRealisasiKeg.length > 1) {
              //hapus double entry
              for (let i = 0; i < tableRealisasiKeg.length; i++) {
                const realKeg = tableRealisasiKeg[i];
                //console.log(realKeg)
                if ( i > 0 && realKeg.stat !== 'Disetujui') {
                  await ekin.evaluate((act) => eval(act), realKeg.act)
                  await ekin.evaluate(hapusRealisasiKegiatan)
                  console.log('hapus double entry')
                }
              }
            }
              /**
              tableRealisasiKeg = await ekin
                .wait(1000)
                .select('#tabel_d_realisasi_kegiatan_length > label > select', '100')
                .insert('#tabel_d_realisasi_kegiatan_filter > label > input', '')
                //.insert('#tabel_d_realisasi_kegiatan_filter > label > input', search)
                .insert('#tabel_d_realisasi_kegiatan_filter > label > input', tglKeg)
                .type('#tabel_d_realisasi_kegiatan_filter > label > input', '')
                .wait(1000)
                .evaluate(tableKegEval, '#tabel_d_realisasi_kegiatan')
               */
          } else {
            if(jmlInp > 0 ){
              await ekin.evaluate(buatKodeRealisasiKeg, act)
            }
            if (kdAktivitas) {
              await ekin.type('#KD_AKTIVITAS', kdAktivitas)
              await ekin.type("#NM_KEGIATAN", '');
              await ekin.insert('#NM_KEGIATAN', keg)
            }
  
            if (jmlInp > 0) {
              await ekin.insert('#KUANTITAS')
              await ekin.insert('#KUANTITAS', jmlInp)
              console.log("diinput:", jmlInp);
            }
  
            if ((tableRealisasiKeg.length && tableRealisasiKeg[0].act) || (jmlInp > 0 && kdAktivitas)) {
              await ekin.click('#JAM_MULAI')
                .wait('#JAM_MULAI > div.bfh-timepicker-popover > table > tbody > tr > td.hour > div > input')
                .insert('#JAM_MULAI > div.bfh-timepicker-popover > table > tbody > tr > td.hour > div > input')
              let res = {}
              let time = 0
              while(!res.msg && time < 10000) {
                res = await ekin.evaluate(saveRealisasiKegiatan)
                console.log(res)
                console.log('total poin:', totalPoin);
                await ekin.wait(1000)

                time += 1000
              }
            }
          }
  
  
        } 
          
      }
      

    }
    
  } catch (err) {
    console.log(err)
  }

}

// const getBln = async ekin => {
//   try{
//     let blnList = {
//       data: []
//     };

//     let data

//     while(!data){
//       data = await ekin.evaluate(() => {
//         let data = get_tb_bulan()
//         return data
//       })
//     }
    

//     await ekin.evaluate(()=> set_bulan())

//     while (!blnList.data.length) {
//       blnList = Object.assign(
//         {},
//         blnList,
//         JSON.parse(
//           await ekin.evaluate(() => {
//             var data = get_tb_bulan();
//             return data;
//           })
//         )
//       );
//     }

//     //console.log(blnList.data);
//     //return blnList

//   }catch(err){
//     console.log(err)
//   }
// }

// const ekinInputBulanan = async (bln, blnNum, u, p) => {
// //   if(bln.toLowerCase() == 'november') {
// //     bln = 'nopember'
// //   }
// //   try {
// //     let { ekin } = await ekinLogin(u,p)
// //     let dataRencanaThn = await ekin
// //       .wait(rencanaBulanan)
// //       .goto(url + rencanaBulananUrl)
// // //      .evaluate(() => insert_tb_bulan())
// //       .evaluate(() => start_data())
// //       .wait("#tabel_d_kegiatan_tahun")
// //       .select("#tabel_d_kegiatan_tahun_length > label > select", "100")
// //       .evaluate(tableKegEval, "#tabel_d_kegiatan_tahun");

// //     await getBln(ekin)

// //     //console.log(blnList.data[0].map(e=> e.NM_BULAN))

// //     let dataRencanaBln = [{ act: null}]
// //     let time = 0

// //     while( !dataRencanaBln.filter(e => e.act !== null ).length && time < 10000) {
// //       dataRencanaBln = await ekin
// //         .wait(1000)
// //         .select('#tabel_d_kegiatan_bulan_length > label > select', '100')
// //         .insert('#tabel_d_kegiatan_bulan_filter > label > input')
// //         .insert('#tabel_d_kegiatan_bulan_filter > label > input', bln)
// //         .evaluate(tableKegEval, '#tabel_d_kegiatan_bulan')

// //       time += 1000
// //     }
    
// //     //console.log(dataRencanaThn)
// //     // console.log(dataRencanaBln)


//     for (let rencThn of dataRencanaThn) {
//       if(!JSON.stringify(rencThn).includes('inap')) {
//         // console.log(rencThn)
//         // let kuantitasBln = Math.ceil(rencThn.text[3] / 12).toFixed()
//         // let rencExist = dataRencanaBln.filter(rencBln => {
//         //   // console.log(rencBln)
//         //   if(rencBln.act) {
//         //     // console.log(rencBln.act)
//         //     let rencBlnArr = rencBln.act.split('\n').filter(e => e !== '').map(e => e.split('\',').join('').split('\'').join('').trim())
//         //     //console.log(rencBlnArr)
//         //     if (rencBlnArr[1] === rencThn.bln) {
//         //       //console.log(rencBln)
//         //       //console.log(rencThn.bln)
//         //       return true
//         //     }
  
//         //   }
//         //   return false
//         // })
//         // await getBln(ekin)
//         if (!rencExist.length){
//           await ekin.evaluate(buatKodeInputBln, rencThn.act)
//           await ekin.evaluate(() => buat_kode_d_kegiatan_bulan())
//           await ekin.select("#KD_BULAN", blnNum)
//           await ekin.insert("#NM_KEGIATAN_BULAN", rencThn.keg)
//         } else {
//           while(rencExist.length > 1) {
//             console.log('hapus duplikasi rencana bulanan')
//             await ekin.evaluate(act=> eval(act), rencExist[0].act )
//             await ekin.evaluate( delInputBulanan )
//             rencExist.shift()
//           }
  
//           //console.log(rencThn)
//           //console.log(rencExist[0])
//           await ekin.evaluate(act=> eval(act), rencExist[0].act )
//         }
  
//         if( (!rencExist.length && kuantitasBln > 0) || (rencExist.length && kuantitasBln > Number(rencExist[0].jml))) {
//           console.log(kuantitasBln)
//           if(rencExist.length){
//             if(rencExist[0].jml > 500){
//               await ekin.wait(10000)
//             }
//             console.log(rencExist[0].jml)
//           }
//           await ekin.insert("#KUANTITAS");
//           await ekin.insert("#KUANTITAS", kuantitasBln)
//           await ekin.wait(500);
//           let res = await ekin.evaluate(saveInputBulanan);
  
//           console.log(res)
//         }
  
//       } else {
//         let rencExist = dataRencanaBln.filter(rencBln => {
//           // console.log(rencBln)
//           if(rencBln.act) {
//             // console.log(rencBln.act)
//             let rencBlnArr = rencBln.act.split('\n').filter(e => e !== '').map(e => e.split('\',').join('').split('\'').join('').trim())
//             //console.log(rencBlnArr)
//             if (rencBlnArr[1] === rencThn.bln) {
//               //console.log(rencBln)
//               //console.log(rencThn.bln)
//               return true
//             }
  
//           }
//           return false
//         })
//         // await getBln(ekin)
//         while(rencExist.length) {
//           console.log('hapus rencana bulanan ranap')
//           await ekin.evaluate(act=> eval(act), rencExist[0].act )
//           await ekin.evaluate( delInputBulanan )
//           rencExist.shift()
//         }

//         //console.log(rencThn)
//         //console.log(rencExist[0])
//         // await ekin.evaluate(act=> eval(act), rencExist[0].act )

//       }
//     }

//     return {
//       ekin, 
//       dataRencanaThn
//     }
//   } catch (err) {
//     console.log(err)
//   }
// }


module.exports = {
  // ekinInputBulanan,
  // ekinLogin,
  ekinGetDataKeg,
  // ekinLoginKepala,
  // ekinLoginKA,
  // ekinLoginTU,
  // approving,
  ekinInputRealisasiKegiatan
}

