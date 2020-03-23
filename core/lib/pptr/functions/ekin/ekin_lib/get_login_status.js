exports._getLoginStatus = async ({ that }) => {
  let isLogin = await that.page.evaluate( async () => localStorage && localStorage.getItem("status_login"))
  if(isLogin){
    isLogin = await that.page.$('#header')
  }
  return isLogin
}