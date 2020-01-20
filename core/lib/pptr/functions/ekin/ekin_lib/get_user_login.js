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