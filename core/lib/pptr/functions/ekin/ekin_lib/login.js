exports._login = async ({ that, nama, username, password }) => {
  that.spinner.start(`go to ${that.config.EKIN_URL}`)
  if(!that.page) {
    that.page = that.pages[0]
  }
  await that.page.goto(that.config.EKIN_URL, that.config.waitOpt)
  // that.spinner.succeed()
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
    // that.spinner.succeed()
  }
  that.spinner.start('get data bulan')
  that.data_bulan = await that.page.evaluate( async () => {
    if(localStorage){
      await $.ajax({
        type: "POST",
        url: "/e-kinerja/v1/layout/data_bulan",
        success: (data) => localStorage.setItem("data_bulan", data)           
      })
      return JSON.parse(localStorage.getItem('data_bulan'))
      // return localStorage.getItem('data_bulan')
    } 
  })
  // that.spinner.succeed(`${that.data_bulan}`)
  that.spinner.succeed(`${that.data_bulan.data.length} bulan`)

}
