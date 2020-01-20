exports._login = async ({ that, nama, username, password }) => {
  that.spinner.start(`go to ${that.config.EKIN_URL}`)
  if(!that.page) {
    that.page = that.pages[0]
  }
  await that.page.goto(that.config.EKIN_URL, that.config.waitOpt)
  that.spinner.succeed()
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
