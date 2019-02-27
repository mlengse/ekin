require('dotenv').config()
const { getEkin } = require('./nmrunner')
const { tableKegEval} = require('./browser')
const url = process.env.EKIN_URL
const username = process.env.EKIN_USERNAME
const password = process.env.EKIN_PASSWORD
const usernameBos = process.env.EKIN_USERNAME_BOS
const passwordBos = process.env.EKIN_PASSWORD_BOS
const loginButton = process.env.LOGIN_BUTTON
const realisasiKegiatan = process.env.REALISASI_KEGIATAN_SELECTOR
const realisasiKegiatanUrl = process.env.REALISASI_KEGIATAN_URL
const tableId = process.env.TABLE_ID

const ekinGetDataKeg = async () => {
  try {
    let { ekin } = await ekinLogin()
    await ekin.wait(realisasiKegiatan)
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
  if(!user){
    user = username
    passw = password
  }
  let ekin = getEkin()
  try {
    await ekin.goto(url)
    let needLogin = await ekin.exists('#USERNAME')
    if(!needLogin){
      let text = await ekin.evaluate(() => document.getElementById('header').textContent)
      let trueLogin = text.includes(user)
      if (!trueLogin){
        await ekin.evaluate(()=> {
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

module.exports = {
  ekinLogin,
  ekinGetDataKeg,
  ekinLoginKepala,
  approving
}

