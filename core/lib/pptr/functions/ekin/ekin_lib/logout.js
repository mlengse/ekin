exports._logout = async ({ that }) => {
  that.spinner.start('logout from ekin')
  await that.page.evaluate(async () => await fetch('/e-kinerja/v1/login/logout'))
  that.isLogin = false
  // that.spinner.succeed()
}