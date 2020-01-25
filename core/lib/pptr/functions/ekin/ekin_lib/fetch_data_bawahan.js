exports._getDataBawahan = async ({ that }) => {
  that.spinner.start(`fetch data staff ${that.user.nl}`)
  that.users[that.user.nama].dataBawahan = await that.page.evaluate(async() => {
    let response = await fetch('/e-kinerja/v1/layout/data_bawahan', {
      method: 'POST',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",                                                                                                
       },
      credentials: 'same-origin',
    })
    let res = await response.json()
    return res.data
  })

  that.spinner.succeed(`${that.users[that.user.nama].dataBawahan.length} data staff dari ${that.user.nl}`)
  
  return that.users[that.user.nama].dataBawahan 

}