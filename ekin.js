require('dotenv').config()
const { getEkin } = require('./nmrunner')
const { tableKegEval, saveInputBulanan, buatKodeInputBln, saveRealisasiKegiatan, buatKodeRealisasiKeg } = require('./browser')
const url = process.env.EKIN_URL
const username = process.env.EKIN_USERNAME
const password = process.env.EKIN_PASSWORD
const usernameBos = process.env.EKIN_USERNAME_BOS
const passwordBos = process.env.EKIN_PASSWORD_BOS
const loginButton = process.env.LOGIN_BUTTON
const rencanaBulanan = process.env.RENCANA_BULANAN_SELECTOR
const rencanaBulananUrl = process.env.RENCANA_BULANAN_URL
const realisasiKegiatan = process.env.REALISASI_KEGIATAN_SELECTOR
const realisasiKegiatanUrl = process.env.REALISASI_KEGIATAN_URL
const tableId = process.env.TABLE_ID


const ekinGetDataKeg = async ({ ekin }) => {
  try {
    await ekin
      .wait(realisasiKegiatan)
      .goto(url + realisasiKegiatanUrl)
      .wait(tableId)
    let dataKeg = await ekin.evaluate(tableKegEval, tableId)
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

const approving = async () => {
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
    let acts = await ekin
      .insert('#tabel_d_approve_realisasi_kegiatan_filter > label > input', 'belum')
      .select('#tabel_d_approve_realisasi_kegiatan_length > label > select', '100')
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
    return { ekin }
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
      console.log(tgl, bln, keg)
      await ekin.wait('#TOTAL_POIN')
      let totalPoin
      while(!totalPoin) {
        totalPoin = await ekin.evaluate(() => document.getElementById('TOTAL_POIN').textContent)
        totalPoin = totalPoin.split(":")[1]
        if(totalPoin){
          totalPoin = Number(totalPoin.split(' ')[1])
        } else {
          totalPoin = false
        }
      }
      console.log(totalPoin)
      if( 8500 > totalPoin ) {
        let tglKeg = `${tgl} ${keg}`

        let tableRealisasiKeg = await ekin
          .select('#tabel_d_realisasi_kegiatan_length > label > select', '100')
          .insert('#tabel_d_realisasi_kegiatan_filter > label > input', '')
          .insert('#tabel_d_realisasi_kegiatan_filter > label > input', tglKeg)
          .evaluate(tableKegEval, '#tabel_d_realisasi_kegiatan')
        //console.log(tableRealisasiKeg[0]);

        if(tableRealisasiKeg[0].act) {
          //act = tableRealisasiKeg[0].act
          //console.log(act);
          //await ekin.evaluate((act)=> eval(act), act)
          console.log('sudah diinput')

        } else {
          let jmlInp = (jml / tglLength).toFixed()
          await ekin.evaluate(buatKodeRealisasiKeg, act)
          if (keg.includes('catatan medik')) {
            await ekin.type('#KD_AKTIVITAS', 'Mencatat')
          } else {
            await ekin.type('#KD_AKTIVITAS', 'Memeriksa')
          }
          await ekin
            .insert('#NM_KEGIATAN', keg)
            .insert('#KUANTITAS', jmlInp)
          
          await ekin.click('#JAM_MULAI')
            .wait('#JAM_MULAI > div.bfh-timepicker-popover > table > tbody > tr > td.hour > div > input')
            .insert('#JAM_MULAI > div.bfh-timepicker-popover > table > tbody > tr > td.hour > div > input', )
          await ekin.evaluate(saveRealisasiKegiatan)
          
          //await ekin.wait(2000)
          console.log('diinput:', jmlInp)

        }


      } else {
        console.log('poin tercapai. selanjutnya silahkan input manual')
      }

    }

  } catch (err) {
    console.log(err)
  }

}

const ekinInputBulanan = async (bln, blnNum) => {
  try {
    let { ekin } = await ekinLogin()
    let dataRencanaThn = await ekin
      .wait(rencanaBulanan)
      .goto(url + rencanaBulananUrl)
      .wait('#tabel_d_kegiatan_tahun')
      .select('#tabel_d_kegiatan_tahun_length > label > select', '100')
      .evaluate(tableKegEval, '#tabel_d_kegiatan_tahun')

    await ekin.evaluate(() => start_data())
    let blnList = null

    while (blnList === null) {
      blnList = await ekin.evaluate(() => {
        var data = get_tb_bulan();
        return data
      })
    }
    let dataRencanaBln = await ekin
      .wait('#tabel_d_kegiatan_bulan')
      .select('#tabel_d_kegiatan_bulan_length > label > select', '100')
      .insert('#tabel_d_kegiatan_bulan_filter > label > input', bln)
      .evaluate(tableKegEval, '#tabel_d_kegiatan_bulan')

    for (let rencThn of dataRencanaThn) {
      let rencExist = dataRencanaBln.filter(rencBln => rencBln.keg && rencBln.keg === rencThn.keg)
      if (!rencExist.length) {
        let res = await ekin
          .evaluate(buatKodeInputBln, rencThn.act)
          .select('#KD_BULAN', blnNum)
          .insert('#NM_KEGIATAN_BULAN', rencThn.keg)
          .insert('#KUANTITAS', (rencThn.text[3] / 12).toFixed())
          //wait(2000)
          .evaluate(saveInputBulanan)

        console.log(res)
      }

    }

    return {
      ekin, dataRencanaThn
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

