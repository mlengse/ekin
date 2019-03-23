require('dotenv').config()
const { getPresensi } = require('./nmrunner')
const moment = require('moment')
moment.locale('id')
const presensiUrl = process.env.PRESENSI_URL
const presensiUser = process.env.PRESENSI_USER
const presensiPassw = process.env.PRESENSI_PASSW
const absensiUrl = process.env.ABSENSI_URL
const absensiEl = process.env.ABSENSI_EL
const loginPresensi = async () => {
  let presensi = getPresensi()
  try{
    await presensi.goto(presensiUrl)
    let needLogin = await presensi.exists('#username')
    if (needLogin) {
      await presensi
        .insert("#username", presensiUser)
        .insert("#password", presensiPassw)
        .click("body > div.container.buat_container > div.login_form > div > form > div:nth-child(2) > button")
    }
    let drop = await presensi.exists('#drop2')
    while(!drop){
      drop = await presensi.exists('#drop2')
    }


    return { presensi }

  }catch(err) {
    console.log(err)
  }
}

const searchTglAndNIP = async( presensi, tgl, bln, list) => {
  try{
    let {
      NIP
    } = list

    let mesg

    presensi.on('page', (ty, msg) => {
      mesg = msg
    })

    await presensi.goto(absensiUrl)
    let tglEl = await presensi.exists('#nip')

    while (!tglEl) {
      tglEl = await presensi.exists('#nip')
    }

    await presensi
//      .click('#nip')
      .type('#nip', '')
      .insert("#nip", NIP)
      .type("#nip", "\u000d");
    let tglInp = moment(`${tgl} ${bln}`, 'DD MMMM YYYY').format('DD/MM/YYYY')
    console.log(tglInp)
    await presensi.select('#tgl', tglInp)
    let nama = await presensi.evaluate(() => $('#nama').val().trim())
    while (!nama || nama === '') {
      nama = await presensi.evaluate(() => $('#nama').val().trim())
    }
    let jamMasuk = await presensi.evaluate(() => $('#jam_masuk').val().trim())
    let jm = moment().format("HH:mm");
    let jk = await presensi.evaluate(() => $('#jam_keluar').val().trim())
    let time = 0
    while (jamMasuk === jm && jamMasuk === jk && time < 5000) {
      time++
      jamMasuk = await presensi.evaluate(() => $('#jam_masuk').val().trim())
      jk = await presensi.evaluate(() => $('#jam_keluar').val().trim())
    }

    let kdAbsen = await presensi.evaluate(() => $('#kd_absen').val())
    while (!kdAbsen) {
      kdAbsen = await presensi.evaluate(() => $('#kd_absen').val())
    }


    mesg = false
    if (!['C', 'DL', 'I'].filter(e => kdAbsen === e).length) {
      let telat = await presensi.evaluate(() => $("#telat").val());

      while(!telat){
        telat = await presensi.evaluate(() => $("#telat").val());
      }


      let bolos = await presensi.evaluate(() => $('#bolos').val())

      while(!bolos){
        bolos = await presensi.evaluate(() => $('#bolos').val())
      }

      if(Number(telat) > 15 || Number(bolos) > 15) {
        let jamWajib = await presensi.evaluate(() => $('#jam_wajib_masuk').val().trim())
        while (!jamWajib) {
          jamWajib = await presensi.evaluate(() => $('#jam_wajib_masuk').val().trim())
        }

        let jamKeluar = await presensi.evaluate(() => $('#jam_wajib_keluar').val().trim())
        while (!jamKeluar) {
          jamKeluar = await presensi.evaluate(() => $('#jam_wajib_keluar').val().trim())
        }

        if (JSON.parse(list.ranap)) {
          console.log(JSON.parse(list.ranap));
          console.log('kd absen', kdAbsen)
          await presensi.select('#kd_absen', 'DL')

        } else {
          if (Number(telat) > 15) {
            console.log("telat", telat);

            console.log('jam wajib masuk', jamWajib)
            let jamInp = moment(jamWajib, 'HH:mm').add(Math.floor(Math.random() * 15), 'minute').format('HH:mm')
            console.log('jam inp', jamInp)

            await presensi.evaluate(jamInp => {
              document.getElementById('jam_masuk').setAttribute('readonly', false)
              $('#jam_masuk').val(jamInp)
            }, jamInp)
          }

          if (Number(bolos) > 15) {
            console.log('bolos', bolos);
            console.log('jam wajib keluar', jamKeluar)
            let jamInpKel = moment(jamKeluar, 'HH:mm').subtract(Math.floor(Math.random() * 15), 'minute').format('HH:mm')
            console.log('jam inp kel', jamInpKel)
            await presensi.evaluate(jamInpKel => {
              document.getElementById('jam_keluar').setAttribute('readonly', false)
              $('#jam_keluar').val(jamInpKel)
            }, jamInpKel)
          }

        }

        await presensi.click("#form_d_absensi > div > button:nth-child(1)")

        while (typeof mesg !== 'string') {
          await presensi.wait(1)
        }

        console.log(mesg)

      }
      
    }

    return mesg


  }catch(err){
    console.log(err)
  }


}

module.exports = {
  loginPresensi,
  searchTglAndNIP
}

