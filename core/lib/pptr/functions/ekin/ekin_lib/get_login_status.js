exports._getLoginStatus = async ({ that }) => {
  that.spinner.start('get data bulan')
  that.data_bulan = await that.page.evaluate( async () => {
    if(localStorage){
      await $.ajax({
        type: "POST",
        url: "/e-kinerja/v1/layout/data_bulan",
        success: (data) => localStorage.setItem("data_bulan", data)           
      })
      return JSON.parse(localStorage.getItem('data_bulan'))
    } 
  })
  that.spinner.succeed(`${that.data_bulan.data.length} bulan`)
  return await that.page.evaluate( async () => localStorage && localStorage.getItem("status_login"))
}