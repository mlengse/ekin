exports._fetchKegSKP = async ({ that, kegSKP }) => {
  that.spinner.start(`fetch keg SKP ${that.thnSKP} ${kegSKP.NAMA} kode ${kegSKP.kodeSKP} ${kegSKP.kegSKP}`)
  let post = {
    url : '/e-kinerja/v1/d_realisasi_skp/get_data_kegiatan',
    data: {
      KD_KEGIATAN_TAHUN : kegSKP.kodeKegSKP
    },
    type: 'POST',
  }
  let res = await that.page.evaluate(async post => {
    return await $.ajax(post)
  }, post)
  return Object.assign({}, kegSKP, JSON.parse(res).data[0])
}