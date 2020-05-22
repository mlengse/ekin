exports._getUserLogin = async ({ that }) => {
  if(!that.isLogin) {
    that.isLogin = await that.getLoginStatus()
  }
  that.spinner.start('get username')
  // await that.page.waitForSelector('#header', that.config.waitOpt)
  let doc = await that.page.$('#header')
  if(doc){
    let response = await that.page.$eval('#header', doc => doc.innerText.trim().split('\n').join('|').split('|').map(e => e.trim()).filter(e => e!=='Keluar'))
    that.user = {
      nl: response[0],
      username: response[1],
      jab: response[2]
    }
  }

    // let response
    // while(!response){
    //   response = await that.page.evaluate( async () => {
    //     let doc = document.getElementById('header')
    //     if(doc){
    //       return doc.innerText.trim().split('\n').join('|').split('|').map(e => e.trim()).filter(e => e!=='Keluar')
    //     }
    //     return null
    //   })
    // }
    // that.user = {
    //   nl: response[0],
    //   username: response[1],
    //   jab: response[2]
    // }
  // }
}