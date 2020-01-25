exports._getUserLogin = async ({ that }) => {
  if(!that.isLogin) {
    that.isLogin = await that.getLoginStatus()
  }
  if( that.isLogin) {
    that.spinner.start('get username')
    let response = await that.page.evaluate( async () => document.getElementById('header').innerText.trim().split('\n').join('|').split('|').map(e => e.trim()).filter(e => e!=='Keluar'))
    that.user = {
      nl: response[0],
      username: response[1],
      jab: response[2]
    }
  }
}