exports._getLoginStatus = async ({ that }) => {
  let ls = await that.page.evaluate(() => !!localStorage)// && localStorage.getItem("status_login"))
  if(ls){
    let loginStatus = await that.page.evaluate(() => localStorage.getItem("status_login"))
    if(loginStatus){
      let isLogin = await that.page.$('#header')
      if(isLogin){
        return true
      }
    }
  }
  return false
}