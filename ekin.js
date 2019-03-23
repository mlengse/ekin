require('dotenv').config()
const { getEkin } = require('./nmrunner')
const moment = require('moment')
const { tableKegEval, saveInputBulanan, buatKodeInputBln, saveRealisasiKegiatan, buatKodeRealisasiKeg } = require('./browser')
const url = process.env.EKIN_URL
//const username = process.env.EKIN_USERNAME
//const password = process.env.EKIN_PASSWORD
const usernameBos = process.env.EKIN_USERNAME_BOS
const passwordBos = process.env.EKIN_PASSWORD_BOS
const loginButton = process.env.LOGIN_BUTTON
const rencanaBulanan = process.env.RENCANA_BULANAN_SELECTOR
const rencanaBulananUrl = process.env.RENCANA_BULANAN_URL
const realisasiKegiatan = process.env.REALISASI_KEGIATAN_SELECTOR
const realisasiKegiatanUrl = process.env.REALISASI_KEGIATAN_URL
const tableId = process.env.TABLE_ID
moment.locale('id')

const ekinGetDataKeg = async ({ ekin }) => {
  try {
    await ekin
      .wait(realisasiKegiatan)
      .goto(url + realisasiKegiatanUrl)
      .wait(tableId)
      .select("#tabel_d_kegiatan_bulan_length > label > select", "100");
    let dataKeg
    while(!dataKeg) {
      dataKeg = await ekin.evaluate(tableKegEval, tableId);
    }
    
    return {
      ekin, dataKeg
    }
  } catch (err) {
    console.log(err)
  }

}

const ekinLogin = async (user, passw) => {
  if (!user) {
    user = username
    passw = password
  }
  let ekin = getEkin()
  try {
    await ekin.goto(url)
    let needLogin = await ekin.exists('#USERNAME')
    if (!needLogin) {
      let text = await ekin.evaluate(() => document.getElementById('header').textContent)
      let trueLogin = text.includes(user)
      if (!trueLogin) {
        await ekin.evaluate(() => {
          window.confirm = () => true
          logout()
        })
        await ekin.goto(url)
      }
    }
    needLogin = await ekin.exists('#USERNAME')
    if (needLogin) {
      await ekin.wait('#USERNAME')
        .insert('#USERNAME', user)
        .insert('#PASSWORD', passw)
        .click(loginButton)
    }
    return { ekin }
  } catch (err) {
    console.log(err)
  }

}

const ekinLoginKepala = async () => {
  try {
    let { ekin } = await ekinLogin(usernameBos, passwordBos)
    return { ekin }
  } catch (err) {
    console.log(err)
  }

}

const approving = async (username, bln) => {
  try {
    const { ekin } = await ekinLoginKepala()
    await ekin
      .goto(`${url}d_approve_realisasi_kegiatan`)
      .wait('#tabel_bawahan')
      .evaluate((username) => klik_data_pegawai_bawahan(username), username)

    let nip = ''
    while (nip !== username) {
      nip = await ekin.evaluate(() => document.getElementById('nip_pegawai').textContent)
    }
    await ekin.wait(1000)
    let acts = await ekin
      .select('#tabel_d_approve_realisasi_kegiatan_length > label > select', '100')
      .insert('#tabel_d_approve_realisasi_kegiatan_filter > label > input', 'Belum ' + bln)
      //.wait(100)
      .evaluate(() => {
        let table = document.getElementById('tabel_d_approve_realisasi_kegiatan')
        let rows = table.querySelectorAll('tr')
        let acts = []
        for (row of rows) {
          let act = row.getAttribute('ondblclick')
          acts.push(act)
        }
        return acts
      })
    for (act of acts) {
      await ekin
        .evaluate(act => eval(act), act)
        .wait(1000)
        .evaluate(() => simpan())
    }
    await ekin.end()
    //return { ekin }
  } catch (err) {
    console.log(err)
  }

}

const ekinInputRealisasiKegiatan = async ({ ekin, tgl, tglLength, dataKeg }) => {
  try {
    let tglNum = Number(tgl)
    await ekin
      .click('#TGL_REALISASI > div.input-group.bfh-datepicker-toggle > span')
      .wait('#TGL_REALISASI > div.bfh-datepicker-calendar > table > tbody td[data-day="' + tglNum + '"]')
      .click('#TGL_REALISASI > div.bfh-datepicker-calendar > table > tbody td[data-day="' + tglNum + '"]')

    for (let { act, bln, keg, jml } of dataKeg) {

      await ekin.wait('#TOTAL_POIN')
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
       // console.log("total poin:", totalPoin);
       // console.log('poin tercapai. selanjutnya silahkan input manual')
        break
      } else {
        let tglSearch = moment(`${tgl} ${bln}`, 'DD MMMM YYYY').format('DD/MM/YYYY')
        let tglKeg = `${tglSearch} ${keg}`

        let searchArr = tglKeg.split('')
        let last = searchArr.pop()
        let search = searchArr.join('')

        let tableRealisasiKeg = await ekin
          .select('#tabel_d_realisasi_kegiatan_length > label > select', '100')
          .insert('#tabel_d_realisasi_kegiatan_filter > label > input', '')
          .insert('#tabel_d_realisasi_kegiatan_filter > label > input', search)
          .type('#tabel_d_realisasi_kegiatan_filter > label > input', last)
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
        } else if (['pasien', 'konsultasi gizi'].filter(e => keg.toLowerCase().includes(e.toLowerCase())).length) {
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
          //console.log('sudah diinput')
          await ekin.evaluate((act) => eval(act), tableRealisasiKeg[0].act)
        } else {
          if(jmlInp > 0 ){
            await ekin.evaluate(buatKodeRealisasiKeg, act)
          }
        }

        if (kdAktivitas) {
          await ekin.type('#KD_AKTIVITAS', kdAktivitas)
          await ekin.type("#NM_KEGIATAN", '');
          await ekin.insert('#NM_KEGIATAN', keg)
        }

        if (jmlInp > 0) {
          await ekin.insert('#KUANTITAS', jmlInp)
          console.log("diinput:", jmlInp);
        }

        if( (tableRealisasiKeg.length && tableRealisasiKeg[0].act) || (jmlInp > 0 && kdAktivitas) ) {
          await ekin.click('#JAM_MULAI')
            .wait('#JAM_MULAI > div.bfh-timepicker-popover > table > tbody > tr > td.hour > div > input')
            .insert('#JAM_MULAI > div.bfh-timepicker-popover > table > tbody > tr > td.hour > div > input')
          let res = await ekin.evaluate(saveRealisasiKegiatan)
          console.log(res)
          console.log('total poin:', totalPoin);
        }

      } 
    }
    
  } catch (err) {
    console.log(err)
  }

}

const getBln = async ekin => {
  try{
    let blnList = {
      data: []
    };

    let data

    while(!data){
      data = await ekin.evaluate(() => {
        let data = get_tb_bulan()
        return data
      })
    }
    

    await ekin.evaluate(()=> set_bulan())

    while (!blnList.data.length) {
      blnList = Object.assign(
        {},
        blnList,
        JSON.parse(
          await ekin.evaluate(() => {
            var data = get_tb_bulan();
            return data;
          })
        )
      );
    }

    //console.log(blnList.data);
    //return blnList

  }catch(err){
    console.log(err)
  }
}

const ekinInputBulanan = async (bln, blnNum, u, p) => {
  try {
    let { ekin } = await ekinLogin(u,p)
    let dataRencanaThn = await ekin
      .wait(rencanaBulanan)
      .goto(url + rencanaBulananUrl)
//      .evaluate(() => insert_tb_bulan())
      .evaluate(() => start_data())
      .wait("#tabel_d_kegiatan_tahun")
      .select("#tabel_d_kegiatan_tahun_length > label > select", "100")
      .evaluate(tableKegEval, "#tabel_d_kegiatan_tahun");

    await getBln(ekin)

    //console.log(blnList.data[0].map(e=> e.NM_BULAN))

    let dataRencanaBln = await ekin
      .wait('#tabel_d_kegiatan_bulan')
      .select('#tabel_d_kegiatan_bulan_length > label > select', '100')
      .insert('#tabel_d_kegiatan_bulan_filter > label > input', bln)
      .evaluate(tableKegEval, '#tabel_d_kegiatan_bulan')

    //console.log(dataRencanaThn)
    //console.log(dataRencanaBln)


    for (let rencThn of dataRencanaThn) {
      let kuantitasBln = Math.ceil(rencThn.text[3] / 12).toFixed()
      let rencExist = dataRencanaBln.filter(rencBln => {
        let rencBlnArr = rencBln.act.split('\n').filter(e=>e!=='').map(e=>e.split('\',').join('').split('\'').join('').trim())
        //console.log(rencBlnArr)
        if(rencBlnArr[1] === rencThn.bln){
          //console.log(rencBln)
          //console.log(rencThn.bln)
          return true
        }
        return false
      })
      await getBln(ekin)
      if (!rencExist.length){
        await ekin.evaluate(buatKodeInputBln, rencThn.act)
        await ekin.evaluate(() => buat_kode_d_kegiatan_bulan())
        await ekin.select("#KD_BULAN", blnNum)
        await ekin.insert("#NM_KEGIATAN_BULAN", rencThn.keg)
      } else {
        //console.log(rencThn)
        //console.log(rencExist[0])
        await ekin.evaluate(act=> eval(act), rencExist[0].act )
      }
      if( (!rencExist.length && kuantitasBln > 0) || (rencExist.length && kuantitasBln > Number(rencExist[0].jml))) {
        console.log(kuantitasBln)
        if(rencExist.length){
          if(rencExist[0].jml > 500){
            await ekin.wait(10000)
          }
          console.log(rencExist[0].jml)
        }
        await ekin.insert("#KUANTITAS", '');
        await ekin.insert("#KUANTITAS", kuantitasBln)
        await ekin.wait(500);
        let res = await ekin.evaluate(saveInputBulanan);

        console.log(res)
      }

    }

    return {
      ekin, 
      dataRencanaThn
    }
  } catch (err) {
    console.log(err)
  }
}


module.exports = {
  ekinInputBulanan,
  ekinLogin,
  ekinGetDataKeg,
  ekinLoginKepala,
  approving,
  ekinInputRealisasiKegiatan
}

