exports._inputKualitas = async ({ that, kegSKP }) => {
  that.spinner.start(`input kualitas ${kegSKP.TARGET_KUALITAS_R} ${kegSKP.kegSKP}`)
  // let opt = [...Array(11).keys()].reduce( (acc, i) => {
  //   i++
  //   acc += "<option value='"+(i)+"' "+(kegSKP.TARGET_PENYELESAIAN_R == i ? 'selected' : '')+" >"+i+"</option>";
  //   return acc
  // },'')
  // let output = that.getOutput().reduce( (acc, item) => {
  //   acc += "<option value='"+item.KD_SATUAN+"' "+(kegSKP.KD_SATUAN_OUTPUT_R == item.KD_SATUAN ? 'selected' : '')+">"+item.NAMA_SATUAN+"</option>"
  //   return acc
  // }, '')

  let post = {
    url   : "/e-kinerja/v1/d_approve_skp/simpan",
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
    // $('#SATUAN_OUTPUT').html(output);
    // $('#TARGET_PENYELESAIAN').html(opt)
    // $('#AK').attr('placeholder', kegSKP.AK_R);
    // $('#TARGET_KUANTITAS').attr('placeholder', kegSKP.TARGET_KUANTITAS_R);
    // $('#TARGET_KUALITAS').attr('placeholder', kegSKP.TARGET_KUALITAS_R);
    // $('#TARGET_KUALITAS').val(kegSKP.TARGET_KUALITAS_R);
    // $('#KD_TAHUN2').val(kegSKP.KD_TAHUN)
    // $('#SATUAN_WAKTU').html('<option value=2>Bulan</option>');
    // $('#BIAYA').attr('placeholder', kegSKP.BIAYA_R);
    // $('#PERHITUNGAN').attr('placeholder', kegSKP.PERHITUNGAN);
    // $('#NILAI_CAPAIAN').attr('placeholder', kegSKP.NILAI_CAPAIAN);
    return await $.ajax(post)
  }, post)
  that.spinner.succeed(`${JSON.parse(res).msg} kualitas ${kegSKP.TARGET_KUALITAS_R} ${kegSKP.kegSKP}`)
  // console.log(res)
}