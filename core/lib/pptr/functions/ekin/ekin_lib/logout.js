exports._logout = async ({ that }) => {
  that.spinner.start('logout from ekin')
  await that.page.evaluate(async () => await fetch('/e-kinerja2/v2/login/logout'))
  that.isLogin = false
  // that.spinner.succeed()
}