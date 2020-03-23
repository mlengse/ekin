exports._login = async ({ that, nama, username, password }) => {
  that.spinner.start(`go to ${that.config.EKIN_URL}`)
  that.page = that.pages[0]
  await that.page.goto(that.config.EKIN_URL, that.config.waitOpt)
  // that.spinner.succeed()
  await that.getUserLogin()
  if(that.user && that.user.username) {
    if(that.user.username === username) {
      that.user = Object.assign({}, that.user, { nama, username, password })
    } else {
      that.isLogin = false
      await that.logout()
    }
  }

  if(!that.isLogin) {
    that.spinner.start(`login ekin user ${nama}`)
    let body =  that.getParams({
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
    await that.page.reload(that.config.waitOpt)
    await that.getUserLogin()
    that.user = Object.assign({}, that.user, { nama, username, password })
    that.spinner.succeed(`logged in user ${that.user.nl} ${that.user.jab}`)
    await that.page.reload(that.config.waitOpt)
  }
  await that.fetchDataBulan()

}
