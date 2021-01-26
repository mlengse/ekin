exports._inputKualitas = async ({ that, kegSKP }) => {
  that.spinner.start(`input kualitas ${kegSKP.TARGET_KUALITAS_R} ${kegSKP.kegSKP}`)

  let post = {
    url   : "/e-kinerja2/v2/d_approve_skp/simpan",
    data  : {
      KD_KEGIATAN_TAHUN: kegSKP.KD_KEGIATAN_TAHUN,
      NM_KEGIATAN_TAHUN: kegSKP.NM_KEGIATAN_TAHUN,
      KD_TAHUN: kegSKP.KD_TAHUN,
      AK: kegSKP.AK,
      TARGET_KUANTITAS: kegSKP.TARGET_KUANTITAS,
      TARGET_KUALITAS: kegSKP.TARGET_KUALITAS_R,
      SATUAN_OUTPUT: kegSKP.SATUAN_OUTPUT,
      TARGET_PENYELESAIAN: kegSKP.TARGET_PENYELESAIAN,
      SATUAN_WAKTU: kegSKP.SATUAN_WAKTU,
      BIAYA: kegSKP.BIAYA
    },
    type  : "POST",
  }

  let res = await that.page.evaluate( async ( post ) => {
   return await $.ajax(post)
  }, post)
  that.spinner.succeed(`${JSON.parse(res).msg} kualitas ${kegSKP.TARGET_KUALITAS_R} ${kegSKP.kegSKP}`)
  // console.log(res)
}