exports._getLoginStatus = async ({ that }) => {
  return await that.page.evaluate( async () => localStorage && localStorage.getItem("status_login"))
}