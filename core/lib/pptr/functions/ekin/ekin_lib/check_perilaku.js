exports._checkPerilaku = async({ that, dataBawahan }) => {
  that.spinner.start('check perilaku')
  let post = {
    type: "POST",
    url: "/e-kinerja2/v2/d_approve_skp/perilaku_pegawai",
    data: {
      KD_SKP: dataBawahan.kodeSKP
    }
  }
  return that.page.evaluate( async post => {
    let el = document.getElementById('report_tabel_nilai_perilaku')
    if(!el){
      el = document.createElement('div')
      el.id = 'report_tabel_nilai_perilaku'
      document.body.appendChild(el)
    }
    el.innerHTML = await $.ajax(post)
    return [...document.getElementById('form_d_approve_skp').querySelectorAll('input')].reduce((accRow, row) => {
      if(row.id && row.value && Number(row.value) > 75 ) {
        accRow[row.id] = row.value
      }
      return accRow
    }, {})
  }, post)
}