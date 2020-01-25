
exports._approve = async ({that, act, poin}) => {
  if(act.act){
    let uraian = Object.keys(act).filter(e=> ['act', 'kode', 'stat', 'bulan', 'res', 'kuantitas', 'poin'].indexOf(e) === -1).map( e => (`, ${act[e]}`)).join('')
    that.spinner.start(`approve ${uraian}`)
    act.res = await that.page.evaluate( async act => {
      const getParams = obj => Object.entries(obj).map(([key, val]) => `${key}=${val}`).join('&')
      let appr = eval(act)
      function klik_data_d_approve_kegiatan_tambahan(NIP,KD_KEGIATAN_TAMBAHAN,NM_KEGIATAN,KD_AKTIVITAS,NM_AKTIVITAS,POIN,TGL_KEGIATAN_TAMBAHAN,KD_TAHUN,KD_BULAN,JAM_MULAI,JAM_SELESAI,NM_BULAN,PEMBERI_TUGAS,KUANTITAS,STATUS,STATUS_REVISI,BIAYA,KETERANGAN,NIP_APPROVE,TGL_APPROVE,NM_STATUS_APPROVE,CATATAN) {
        return {
          KD_KEGIATAN_TAMBAHAN,
          PEMBERI_TUGAS,
          NM_KEGIATAN,
          KD_AKTIVITAS,
          TGL_KEGIATAN_TAMBAHAN,
          JAM_MULAI,
          JAM_SELESAI,
          KUANTITAS,
          BIAYA,
          KETERANGAN,
          STATUS: 'S',
          CATATAN
        }
      }
      
      function klik_data_d_approve_realisasi_kegiatan(KD_TAHUN,KD_KEGIATAN_TAHUN,NM_KEGIATAN_TAHUN,KD_BULAN,NM_BULAN,KD_KEGIATAN_BULAN,NM_KEGIATAN_BULAN,KD_REALISASI_KEGIATAN,NM_KEGIATAN,NIP,KD_AKTIVITAS,NM_AKTIVITAS,TGL_REALISASI,JAM_MULAI, JAM_SELESAI,KUANTITAS,STATUS,STATUS_REVISI,BIAYA,KETERANGAN) {
        return {
          STATUS: 'S',
          KD_KEGIATAN_BULAN,
          NM_KEGIATAN_BULAN,
          KD_REALISASI_KEGIATAN,
          NM_KEGIATAN,
          NM_AKTIVITAS,
          KUANTITAS,
          TGL_REALISASI,
          JAM_MULAI,
          JAM_SELESAI,
          BIAYA,
          KETERANGAN
        }
      }
      async function simpan(url){
        let response = await fetch(`/e-kinerja/v1/${url}/simpan`, {
          method: 'POST',
          headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",                                                                                                
          },
          credentials: 'same-origin',
          body: getParams(appr),
        })
        return await response.json()
      }
      if(act.includes('klik_data_d_approve_realisasi_kegiatan')){
        return await simpan('d_approve_realisasi_kegiatan')
      } else {
        return await simpan('d_approve_kegiatan_tambahan')
      }
  
    }, act.act)
    poin += act.poin
    that.spinner.succeed(`${act.res.msg}, total poin ${poin}${uraian}`)
  }
  return poin
}
