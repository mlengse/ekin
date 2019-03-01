require('dotenv').config()
const { getEkin } = require('./nmrunner')
const { tableKegEval } = require('./browser')
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


const ekinGetDataKeg = async () => {
  try {
    let { ekin } = await ekinLogin()
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

const ekinInputRealisasiKegiatan = async (tgl, dataKeg) => {
  try {
    await ekin.click('#TGL_REALISASI')
      .wait('#TGL_REALISASI > .bfh-datepicker-calendar > table > tbody td[data-day="' + tgl + '"]')
      .click('#TGL_REALISASI > .bfh-datepicker-calendar > table > tbody td[data-day="' + tgl + '"]')

    for (let { act, bln, keg, jml } of dataKeg) {
      let jmlInp = (jml / tgls.length).toFixed()
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
    console.log(blnList)
    let dataRencanaBln = await ekin
      .wait('#tabel_d_kegiatan_bulan')
      .select('#tabel_d_kegiatan_bulan_length > label > select', '100')
      .type('#tabel_d_kegiatan_bulan_filter > label > input', bln)
      .evaluate(tableKegEval, '#tabel_d_kegiatan_bulan')

    for (let rencThn of dataRencanaThn) {
      let rencExist = dataRencanaBln.filter(rencBln => rencBln.keg && rencBln.keg === rencThn.keg)
      if (!rencExist.length) {
        let res = await ekin
          .evaluate(act => {
            eval(act)
            window.confirm = function (_, __) {
              return true
            }
            buat_kode_d_kegiatan_bulan()
          }, rencThn.act)
          .select('#KD_BULAN', blnNum)
          .insert('#NM_KEGIATAN_BULAN', rencThn.keg)
          .insert('#KUANTITAS', (rencThn.text[3] / 12).toFixed())
          .wait(2000)
          .evaluate(() => {
            window.alert = (_) => true
            return new Promise(resolve => {
              $.ajax({
                type: 'POST',
                url: "http://203.190.116.234/e-kinerja/v1/d_kegiatan_bulan/simpan",
                data: $("#form_d_kegiatan_bulan").serialize(),
                success: function (data) {
                  data = JSON.parse(data);
                  if (data.status) {
                    resolve(data)
                    hide_loading();
                    tabel_d_kegiatan_bulan();
                    alert('Berhasil menyimpan data');
                    alert('data berhasil disimpan');
                    batal();
                  }
                  else {
                    resolve(data)
                    hide_loading();
                    alert('Gagal menyimpan data : ' + data.error);
                  }

                },
                error: function (xhr, textStatus, errorThrown) {
                  resolve(textStatus)
                  hide_loading();
                  alert('Gagal menyimpan data:' + data.error);
                }
              });
            })
          })

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

