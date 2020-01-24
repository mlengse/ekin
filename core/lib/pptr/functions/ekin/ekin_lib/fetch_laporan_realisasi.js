exports._getLaporanRealisasi = async ({that, nip, blnNum, thn}) => {
  let post = {
    method: 'POST',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",                                                                                                
    },
    credentials: 'same-origin',
    body: that.getParams({
      NIP: nip, 
      KD_BULAN: blnNum, 
      KD_TAHUN: thn
    }),
  }
  await that.page.reload()

  return await that.page.evaluate(async post => {
    let wrapper = document.querySelector('div')

    let response = await fetch('/e-kinerja/v1/laporan_realisasi/tabel_laporan_realisasi', post)
    wrapper.insertAdjacentHTML('afterend', await response.text())
    let table = document.getElementById('tabel_d_realisasi_kegiatan').querySelectorAll('tr')
    let response2 = await fetch('/e-kinerja/v1/laporan_realisasi/tabel_laporan_tambahan', post)
    wrapper.insertAdjacentHTML('afterend', await response2.text())
    let table2 = document.getElementById('tabel_laporan_tambahan').querySelectorAll('tr')
    let acts = [...table, ...table2].reduce( (actsAcc, row) => {
      let text = [...row.querySelectorAll('td')].reduce( ( acc, col) => {
        acc.push(col.textContent.split('\n').join('').split('  ').join(''))
        return acc
      }, [])
      if(text[5] && text[5].toLowerCase().includes('belum')){
        actsAcc[text[0]] = {
          kode: text[0],
          nama: text[1],
          tgl: text[2],
          kuantitas: text[3],
          poin: Number(text[4]),
          stat: text[5],
        }
      }
      return actsAcc
    }, {})
    return acts
  }, post)
}