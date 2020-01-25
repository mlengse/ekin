exports._getLaporanTamsil = async ({that, blnNum, thn}) => {
  let satker = that.satker
  await that.getSatker()
  that.spinner.start(`fetch laporan tamsil staff ${that.user.nama}`)
  if(that.satker !== satker) {
    let post = {
      method: 'POST',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",                                                                                                
       },
      credentials: 'same-origin',
      body: that.getParams({
        // KD_SATKER_INDUK: $('KD_SATKER_INDUK').val(), 
        KD_SATKER: that.satker,
        KD_BULAN: blnNum.toString(), 
        KD_TAHUN: thn
      }),
    }
    that.tamsil = await that.page.evaluate(async post => {
      let response = await fetch('/e-kinerja/v1/laporan_realisasi_pegawai/tabel_laporan_tamsil', post)
      let wrapper = document.querySelector('div')
      wrapper.insertAdjacentHTML('afterend', await response.text())
      let table = document.getElementById('tabel_laporan_tamsil')

      let acts = [...table.querySelectorAll('tr')].reduce((rows, row) => {
        let r = [...row.querySelectorAll('td')].reduce((acc, td, i) => {
          td.textContent ? acc[Object.keys(acc)[i]] = td.textContent : null
          return acc
        }, {
          no: null,
          nip: null,
          nama: null,
          pangkat: null,
          golongan: null,
          jabatan: null,
          tpp: null,
          absenPersen: null,
          absenTPP: null,
          poin: null,
          kinerjaPersen: null,
          kinerjaTPP: null,
          totalTPP: null
        })
        r && rows.push(r)
        return rows
      }, [])
      return acts
    }, post)
  }

  let dataBawahan = that.users[that.user.nama].dataBawahan
  let indexNIPs = dataBawahan.map(({NIP_18}) => NIP_18 )
  that.filteredTamsil = that.tamsil.filter( tamsil => indexNIPs.indexOf(tamsil.nip) > -1 && Number(parseFloat(tamsil.kinerjaPersen)/100) < 1)
  that.spinner.succeed(`${that.filteredTamsil.length} laporan tamsil staff dari ${that.user.nama} dengan kinerja < 100%`)
  return that.filteredTamsil
  
}