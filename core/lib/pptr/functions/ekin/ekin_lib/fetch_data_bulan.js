exports._fetchDataBulan = async({ that }) => {
  that.data_bulan = that.getDataBulan()
  if(!that.data_bulan.length) {
    that.spinner.start('get data bulan')
    let res = await that.page.evaluate( async () => {
      if(localStorage){
        await $.ajax({
          type: "POST",
          url: "/e-kinerja/v1/layout/data_bulan",
          success: (data) => localStorage.setItem("data_bulan", data)           
        })
        return JSON.parse(localStorage.getItem('data_bulan'))
      } 
    })
    that.data_bulan = res.data
    that.data_bulan.map( data_bulan => that.addDataBulan(data_bulan))
    that.bulan_opt = that.data_bulan.reduce( (acc, row) => acc += "<option value='"+row.KD_BULAN+"'>"+row.NM_BULAN+"</option>", '')
    that.spinner.succeed(`${that.data_bulan.length} bulan`)
  }

}