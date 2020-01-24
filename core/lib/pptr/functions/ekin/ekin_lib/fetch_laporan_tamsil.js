exports._getLaporanTamsil = async ({that, blnNum, thn}) => {
  let satker = that.satker
  await that.getSatker()
  that.spinner.start(`fetch laporan tamsil staff ${that.user.nama}`)
  if(that.satker !== satker) {
    that.tamsil = await that.page.evaluate(async (KD_SATKER, KD_BULAN, KD_TAHUN) => {
      let getParams = obj => Object.entries(obj).map(([key, val]) => `${key}=${val}`).join('&')
      let response = await fetch('/e-kinerja/v1/laporan_realisasi_pegawai/tabel_laporan_tamsil', {
        method: 'POST',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",                                                                                                
         },
        credentials: 'same-origin',
        body: getParams({
          // KD_SATKER_INDUK: $('KD_SATKER_INDUK').val(), 
          KD_SATKER,
          KD_BULAN, 
          KD_TAHUN
        }),
      })
      let wrapper = document.querySelector('div')
      wrapper.insertAdjacentHTML('afterend', await response.text())
      let table = document.getElementById('tabel_laporan_tamsil')
      let rows = table.querySelectorAll('tr')
      let acts = []
      for (row of rows) {
        let tds = row.querySelectorAll('td')
        let r = Array.from(tds).reduce((acc, td, i) => {
          acc[Object.keys(acc)[i]] = td.textContent
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
        acts.push(r)
      }
      return acts
    }, that.satker, blnNum.toString(), thn)
  }

  let dataBawahan = that.users[that.user.nama].dataBawahan
  let indexNIPs = dataBawahan.map(({NIP_18}) => NIP_18 )
  let filteredTamsil = that.tamsil.filter( tamsil => indexNIPs.indexOf(tamsil.nip) > -1 && Number(parseFloat(tamsil.kinerjaPersen)/100) < 1)
  that.spinner.succeed(`${filteredTamsil.length} laporan tamsil staff dari ${that.user.nama} dengan kinerja < 100%`)
  return filteredTamsil
  
}