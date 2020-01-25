exports._getDataApprovalBawahan = async ({that, acts, dataBawahan}) => {
  if(Object.keys(acts).length) {
    let post = {
      method: 'POST',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",                                                                                                
       },
      credentials: 'same-origin',
      body: that.getParams({
        NIP_BAWAHAN: dataBawahan.NIP_18
      }),
    }

    that.spinner.start(`fetch data approval dari ${Object.keys(acts).length} laporan realisasi`)
    await that.page.reload()

    acts = await await that.page.evaluate(async (acts, post) => {
      let wrapper = document.querySelector('div')
      let response = await fetch('/e-kinerja/v1/d_approve_realisasi_kegiatan/tabel_d_approve_realisasi_kegiatan', post)
      wrapper.insertAdjacentHTML('afterend', await response.text() )
      let table = document.getElementById('tabel_d_approve_realisasi_kegiatan').querySelectorAll('tr')
      let response2 = await fetch('/e-kinerja/v1/d_approve_kegiatan_tambahan/tabel_d_approve_kegiatan_tambahan', post)
      wrapper.insertAdjacentHTML('afterend', await response2.text() )
      let table2 = document.getElementById('tabel_d_approve_kegiatan_tambahan').querySelectorAll('tr')
      acts = [...table, ...table2].reduce( (actsAcc, row) => {
        let actEl = row.getAttribute('ondblclick')
        if(actEl) {
          let act = actEl.split('\n').map(e=>e.trim()).join('')
  
          for(let kode in  actsAcc) {
            if(act.includes(kode)){
              actsAcc[kode].act = act
            }
          }
        }
        return actsAcc
      }, acts)
      return acts
    }, acts, post )

    acts = Object.keys(acts).map(e => acts[e])

    that.spinner.succeed(`${Object.keys(acts).length} realisasi kegiatan belum approve dari ${dataBawahan.NAMA}`)
  }

  return acts

}
