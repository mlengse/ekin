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
        kdKegBln: tabs[0].textContent,
        nmKegBln: tabs[1].textContent,
        tgtKuant: Number(tabs[3].textContent),
        tgtWkt: tabs[4].textContent,
        status: tabs[5].textContent,
        act: act.slice(act.indexOf('(')+1, act.indexOf(')')).split("'").join('').split(','),
      }
    }).filter( e => e.kdKegBln )
    return rows
  }, that.kdSKP )
  that.spinner.succeed(`keg thn:\n${that.kegTahun.map(({nmKegBln, tgtKuant}) => `${nmKegBln} (${tgtKuant})`).join('\n')}`)
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

exports._getLoginStatus = async ({ that }) => await that.page.evaluate(() => localStorage && localStorage.getItem("status_login"))

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

