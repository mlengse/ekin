exports._inputKegiatan = async({ that, keg }) => {
  that.spinner.start('input kegiatan')
  let dataKd = await that.page.evaluate( async opt => {
    window.confirm = (_, __) => true
    $("#KD_BULAN").html(opt);
    return await $.ajax({
      type: "POST",
      url: "/e-kinerja2/v2/d_realisasi_kegiatan/buat_kode_d_realisasi_kegiatan",
    })
  }, that.bulan_opt)
  if(dataKd){
    dataKd = JSON.parse(dataKd);
    // console.log(dataKd)
    if(dataKd.status) {
      let kd = await that.page.evaluate( async (keg, dataKd) => {
        let data
        function klik_data_d_kegiatan_bulan(_____,____,KD_KEGIATAN_BULAN,___,NM_KEGIATAN_BULAN,__,_,KETERANGAN){
          data = { 
            KD_KEGIATAN_BULAN,
            NM_KEGIATAN_BULAN,
            KD_REALISASI_KEGIATAN: dataKd.data[0].KD_REALISASI_KEGIATAN,
            NM_KEGIATAN: keg.nmKeg,
            KD_AKTIVITAS: keg.KD_AKTIVITAS,
            KUANTITAS: keg.jmlInp,
            TGL_REALISASI: keg.tgl,
            JAM_MULAI: '08:00',
            JAM_SELESAI: '08:00',
            KETERANGAN                  
          }
        }
        eval(keg.act)
        let dataSmp = await $.ajax({
          type: "POST",
          url: "/e-kinerja2/v2/d_realisasi_kegiatan/simpan",
          data
        })
        dataSmp = JSON.parse(dataSmp)
        return Object.assign({}, dataKd.data[0], dataSmp, keg)
    
      }, keg, dataKd)
      that.spinner.succeed(`${kd.msg} ${kd.tgl} ${kd.nmKeg}`)
      if(kd.error === null && kd.msg === "Data berhasil disimpan") {
        await that.fetchRealKeg({ tgl: keg.tgl })
      }
        
    }
  }


}