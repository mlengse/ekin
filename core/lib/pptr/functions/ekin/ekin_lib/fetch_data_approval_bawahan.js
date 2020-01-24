exports._getDataApprovalBawahan = async ({that, acts, nip, bln}) => {
  let post = {
    method: 'POST',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",                                                                                                
     },
    credentials: 'same-origin',
    body: that.getParams({
      NIP_BAWAHAN: nip
    }),
  }
  await that.page.reload()
  return await that.page.evaluate(async (acts, post, bulan) => {
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
  }, acts, post, bln )

}
