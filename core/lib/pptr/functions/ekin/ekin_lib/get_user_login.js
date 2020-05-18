exports._getUserLogin = async ({ that }) => {
  if(!that.isLogin) {
    that.isLogin = await that.getLoginStatus()
  }
  if( that.isLogin) {
    that.spinner.start('get username')
    let response
    while(!response){
      response = await that.page.evaluate( async () => {
        let doc = document.getElementById('header')
        if(doc){
          return doc.innerText.trim().split('\n').join('|').split('|').map(e => e.trim()).filter(e => e!=='Keluar')
        }
        return null
      })
    }
    that.user = {
      nl: response[0],
      username: response[1],
      jab: response[2]
    }
  }
}