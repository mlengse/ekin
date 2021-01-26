exports._getLaporanRealisasi = async ({that, dataBawahan, blnNum, thn}) => {
  that.spinner.start(`fetch laporan realisasi ${dataBawahan.NAMA}: ${dataBawahan.poin}`)
  let post = {
    method: 'POST',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",                                                                                                
    },
    credentials: 'same-origin',
    body: that.getParams({
      NIP: dataBawahan.nip, 
      KD_BULAN: blnNum, 
      KD_TAHUN: thn
    }),
  }
  await that.page.reload()

  return await that.evalTimedOut({
    evalFunc: [async post => {
      let wrapper = document.querySelector('div')
      let response = await fetch('/e-kinerja2/v2/laporan_realisasi/tabel_laporan_realisasi', post)
      wrapper.insertAdjacentHTML('afterend', await response.text())
      let table = document.getElementById('tabel_d_realisasi_kegiatan')
      let response2 = await fetch('/e-kinerja2/v2/laporan_realisasi/tabel_laporan_tambahan', post)
      wrapper.insertAdjacentHTML('afterend', await response2.text())
      let table2 = document.getElementById('tabel_laporan_tambahan')
      let acts1 = [...table.querySelectorAll('tr')].reduce( (actsAcc, row) => {
        let text = [...row.querySelectorAll('td')].reduce( ( acc, col) => {
          acc.push(col.textContent.split('\n').join('').split('  ').join(''))
          return acc
        }, [])
        if(text[5] /*&& text[5].toLowerCase().includes('belum')*/){
          actsAcc[text[0]] = {
            kode: text[0],
            nama: text[1],
            tgl: text[2],
            kuantitas: text[3],
            poin: Number(text[4]),
            stat: text[5],
            keg: 'utama'
          }
        }
        return actsAcc
      }, {})

      let acts2 = [...table2.querySelectorAll('tr')].reduce( (actsAcc, row) => {
        let text = [...row.querySelectorAll('td')].reduce( ( acc, col) => {
          acc.push(col.textContent.split('\n').join('').split('  ').join(''))
          return acc
        }, [])
        if(text[5] /*&& text[5].toLowerCase().includes('belum')*/){
          actsAcc[text[0]] = {
            kode: text[0],
            nama: text[1],
            tgl: text[2],
            kuantitas: text[3],
            poin: Number(text[4]),
            stat: text[5],
            keg: 'tambahan'
          }
        }
        return actsAcc
      }, {})

      acts = Object.assign({}, acts1, acts2)
  
      if(Object.keys(acts).length){
        return acts
      }
      // return {}
      // acts.err = false
      return table.textContent
    }, post]
  })
}