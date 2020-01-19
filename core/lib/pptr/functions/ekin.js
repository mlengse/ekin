exports._inputBln = async ({ that, act, blnNum, kuant }) => {
  that.spinner.start('input bulanan')
  let kd = await that.page.evaluate( async (act, blnNum, kuant) => {
    let data_bulan = JSON.parse(localStorage.getItem("data_bulan"));
    data_bulan.status ? data_bulan = data_bulan.data : null
    let opt = ''
    for( let row of data_bulan) opt += "<option value='"+row.KD_BULAN+"'>"+row.NM_BULAN+"</option>"
    $("#KD_BULAN").html(opt);
    const klik_data_d_kegiatan_tahun = (KD_KEGIATAN_TAHUN,NM_KEGIATAN_TAHUN) => {
      $("#KD_KEGIATAN_TAHUN").val(KD_KEGIATAN_TAHUN);
      $("#NM_KEGIATAN_TAHUN").val(NM_KEGIATAN_TAHUN);
      $("#KD_KEGIATAN_BULAN").val('');
      $("#KD_BULAN").val(blnNum);
      $("#NM_KEGIATAN_BULAN").val(NM_KEGIATAN_TAHUN);
      $("#KUANTITAS").val(kuant);
      $("#BIAYA").val('');
      $("#KETERANGAN").val('');
    }
    window.confirm = (_, __) => true
    klik_data_d_kegiatan_tahun(...act)
    let dataKd = await $.ajax({
      type: "POST",
      url: "/e-kinerja/v1/d_kegiatan_bulan/buat_kode_d_kegiatan_bulan"
    })
    if(dataKd){
      dataKd = JSON.parse(dataKd);
      if(dataKd.status) {
        let kd_kegiatan_bulan = dataKd.data[0].KD_KEGIATAN_BULAN;
        $("#KD_KEGIATAN_BULAN").val(kd_kegiatan_bulan);
        let dataSmp = await $.ajax({
          type: 'POST',
          url: "/e-kinerja/v1/d_kegiatan_bulan/simpan",
          data: $("#form_d_kegiatan_bulan").serialize(),
        })
        dataSmp = JSON.parse(dataSmp)
        return { kd_kegiatan_bulan, dataSmp, act, blnNum, kuant }
      }
    }
  }, act, blnNum, kuant)
  that.spinner.succeed(`${JSON.stringify(kd)}`)
}

exports._getKegBulan = async ({ that, bln }) => {
  that.spinner.start('get keg bulan')
  that.kegBulan = await that.page.evaluate( async bln => {
    document.querySelector('div').insertAdjacentHTML('afterend', await $.ajax({
      type: "POST",
      url: "/e-kinerja/v1/d_kegiatan_bulan/tabel_d_kegiatan_bulan"
    }))
    let rows = [...document.getElementById('tabel_d_kegiatan_bulan').querySelectorAll('tr')].map( row => {
      let tabs = [...row.querySelectorAll('td')]
      if( !tabs[0]) {
        return {}
      }
      let act = tabs[4].getAttribute('ontouchstart')
      return {
        bln: tabs[0].textContent,
        nmKeg: tabs[1].textContent,
        tgtKuant: Number(tabs[2].textContent),
        status: tabs[3].textContent,
        act: act.slice(act.indexOf('(')+1, act.indexOf(')')).split("'").join('').split(','),
      }
    }).filter( e => e.bln && e.bln === bln )
    return rows
  }, bln )
  that.spinner.succeed(`${that.kegBulan.length} kegiatan bulanan`)
}

exports._getKegTahun = async({ that }) => {
  that.spinner.start(`get keg tahun ${that.kdSKP}`)
  that.kegTahun = await that.page.evaluate(async KD_SKP => {
    document.querySelector('div').insertAdjacentHTML('afterend', await $.ajax({
      type: "POST",
      url: "/e-kinerja/v1/d_kegiatan_bulan/tabel_d_kegiatan_tahun",
      data: { KD_SKP }
    }))
    let rows = [...document.getElementById('tabel_d_kegiatan_tahun').querySelectorAll('tr')].map( row => {
      let tabs = [...row.querySelectorAll('td')]
      if( !tabs[0]) {
        return {}
      }
      let act = tabs[6].getAttribute('ontouchstart')
      return {
        kdKeg: tabs[0].textContent,
        nmKeg: tabs[1].textContent,
        tgtKuant: Number(tabs[3].textContent),
        tgtWkt: tabs[4].textContent,
        status: tabs[5].textContent,
        act: act.slice(act.indexOf('(')+1, act.indexOf(')')).split("'").join('').split(','),
      }
    }).filter( e => e.kdKeg )
    return rows
  }, that.kdSKP )
  that.spinner.succeed(`${that.kegTahun.length} kegiatan tahunan`)
}

exports._logout = async ({ that }) => {
  that.spinner.start('logout from ekin')
  await that.page.evaluate(async () => await fetch('/e-kinerja/v1/login/logout'))
  that.isLogin = false
  that.spinner.succeed()
}

exports._getKdSKP = async ({ that }) => {
  if(!that.kdSKP) {
    that.spinner.start('get kode skp')
    that.kdSKP = await that.page.evaluate(async () => {
      document.querySelector('div').insertAdjacentHTML('afterend', await (await fetch('/e-kinerja/v1/d_kegiatan_bulan', {
        headers: { "Content-Type": "text/html; charset=UTF-8" },
        credentials: 'same-origin',
      })).text())
      return document.getElementById('KD_SKP').value
    })
    that.spinner.succeed(`kd skp: ${that.kdSKP}`)
  }
  return that.kdSKP
}

exports._getUserLogin = async ({ that }) => {
  if(!that.isLogin) {
    that.isLogin = await that.getLoginStatus()
  }
  if( that.isLogin && !that.user) {
    that.spinner.start('get username')
    let response = await that.page.evaluate( async () => {
      // let res = await fetch('/e-kinerja/v1/home', {
      //   headers: { "Content-Type": "text/html; charset=UTF-8" },
      //   credentials: 'same-origin',
      // })
      // document.querySelector('div').insertAdjacentHTML('afterend', await res.text())
      return document.getElementById('header').innerText.trim().split('\n').join('|').split('|').map(e => e.trim()).filter(e => e!=='Keluar')
    })
    that.user = {
      nl: response[0],
      username: response[1],
      jab: response[2]
    }
    that.spinner.succeed(`username: ${that.user.nl}, ${that.user.jab}`)
  }
}

exports._getLoginStatus = async ({ that }) => await that.page.evaluate( async () => {
  if(localStorage){
    await $.ajax({
      type: "POST",
      url: "/e-kinerja/v1/layout/data_bulan",
      success: (data) => localStorage.setItem("data_bulan", data)           
    })
    return localStorage.getItem("status_login")
  } 
})

exports.getParams = obj => Object.entries(obj).map(([key, val]) => `${key}=${val}`).join('&')

exports._login = async ({ that, nama, username, password }) => {
  await that.getUserLogin()
  if(that.user && that.user.username) {
    if(that.user.username === username) {
      that.user = Object.assign({}, that.user, { nama, password })
    } else {
      that.user = { nama, username, password }
      await that.logout()
    }
  }

  if(!that.isLogin) {
    that.spinner.start(`login ekin user ${nama}`)
    let body =  this.getParams({
      USERNAME: username,
      PASSWORD: password
    })
    let res = await that.page.evaluate(async body => {
      let res = await fetch('/e-kinerja/v1/login/cek_login', {
        method: 'POST',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",                                                                                                
          },
        credentials: 'same-origin',
        body
      })
      return res.json()
    }, body)
    that.isLogin = res.status
    that.spinner.succeed()
  }
}

