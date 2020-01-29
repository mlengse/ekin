exports._inputBln = async ({ that, act, blnNum, kuant }) => {
  that.spinner.start('input bulanan')
  if(!that.bulan_opt){
    await that.fetchDataBulan()
  }
  await that.page.goto(`${that.config.EKIN_URL}/d_kegiatan_bulan`, that.config.waitOpt)
  let kd = await that.page.evaluate( async (act, blnNum, kuant, opt) => {
    window.confirm = (_, __) => true
    $("#KD_BULAN").html(opt);
    const klik_data_d_kegiatan_tahun = (KD_KEGIATAN_TAHUN,NM_KEGIATAN_TAHUN) => {
      $("#KD_KEGIATAN_TAHUN").val(KD_KEGIATAN_TAHUN);
      $("#NM_KEGIATAN_TAHUN").val(NM_KEGIATAN_TAHUN);
      $("#KD_KEGIATAN_BULAN").val('');
      $("#KD_BULAN").val(blnNum);
      $("#NM_KEGIATAN_BULAN").val(NM_KEGIATAN_TAHUN);
      $("#KUANTITAS").val(kuant);
      $("#BIAYA").val('');
      $("#KETERANGAN").val('');
    }
    eval(act)
    let dataKd = await $.ajax({
      type: "POST",
      url: "/e-kinerja/v1/d_kegiatan_bulan/buat_kode_d_kegiatan_bulan"
    })
    if(dataKd){
      dataKd = JSON.parse(dataKd);
      if(dataKd.status) {
        let kd_kegiatan_bulan = dataKd.data[0].KD_KEGIATAN_BULAN;
        $("#KD_KEGIATAN_BULAN").val(kd_kegiatan_bulan);
        let dataSmp = await $.ajax({
          type: 'POST',
          url: "/e-kinerja/v1/d_kegiatan_bulan/simpan",
          data: $("#form_d_kegiatan_bulan").serialize(),
        })
        dataSmp = JSON.parse(dataSmp)
        return { kd_kegiatan_bulan, dataSmp, act, blnNum, kuant }
      }
    }
  }, act, blnNum, kuant, that.bulan_opt)
  that.spinner.succeed(`${kd.dataSmp.msg} ${kd.act}`)
}