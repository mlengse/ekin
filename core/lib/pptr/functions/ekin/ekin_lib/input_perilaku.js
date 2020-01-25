exports._inputPerilaku = async ({ that, dataBawahan }) => {
  let data = {
    KD_SKP : dataBawahan.kodeSKP,
    ORIENTASI : that.getKualitasRand(),
    INTEGRITAS : that.getKualitasRand(),
    KOMITMEN : that.getKualitasRand(),
    DISIPLIN : that.getKualitasRand(),
    KERJASAMA : that.getKualitasRand(),
    KEPEMIMPINAN : that.getKualitasRand()
  }
  that.spinner.start(`input perilaku${Object.keys(data).map( e => ` ${e} ${data[e]}`).join(',')}`)
  let res = await that.page.evaluate( async data => {
    return $.ajax({
			url  : "/e-kinerja/v1/d_approve_skp/insert_perilaku",
			type : "POST",
			data 
    })
  }, data)
  that.spinner.succeed(`${JSON.parse(res).msg} perilaku${Object.keys(data).map( e => ` ${e} ${data[e]}`).join(',')}`)

}