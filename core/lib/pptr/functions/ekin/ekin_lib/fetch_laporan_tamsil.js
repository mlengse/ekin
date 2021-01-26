exports._getLaporanTamsil = async ({that, a }) => {
  let { blnNum, thn } = that.tgl[a]
  // console.log(blnNum, blnNum.toString(), thn)
  let satker = that.satker
  await that.getSatker()
  that.spinner.start(`fetch laporan tamsil staff ${that.user.nl} bln ${blnNum} ${thn}`)
  // if(that.satker !== satker) {
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
    that.tamsil = await that.evalTimedOut({
      evalFunc: [async post => {
        let response = await fetch('/e-kinerja2/v2/laporan_realisasi_pegawai/tabel_laporan_tamsil', post)
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
      }, post]
    })
  // }

  let dataBawahan = that.users[that.user.nama].dataBawahan

  let indexNIPs = dataBawahan.map(({NIP_18}) => NIP_18 )
  that.tamsil = that.tamsil.filter( tamsil => indexNIPs.indexOf(tamsil.nip) > -1 && that.dataBawahanObj[tamsil.nip])
  that.filteredTamsil = that.tamsil.filter( tamsil => Number(parseFloat(tamsil.kinerjaPersen)/100) < 1)
  // console.log(that.filteredTamsil)
  if(that.filteredTamsil.length) {
    that.spinner.succeed(`${that.filteredTamsil.length} laporan tamsil staff dari ${that.user.nl} bln ${blnNum} ${thn} dengan kinerja < 100%`)
  } else {
    that.spinner.succeed(`${that.tamsil.length} laporan tamsil staff dari ${that.user.nl} bln ${blnNum} ${thn} keseluruhan sudah approve`)
  }
  return that.filteredTamsil
  
}