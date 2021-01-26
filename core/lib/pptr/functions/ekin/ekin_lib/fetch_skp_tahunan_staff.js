exports._fetchSKPTahunanStaff = async({ that, dataBawahan}) => {
  that.spinner.start(`fetch SKP ${that.thnSKP} ${dataBawahan.NAMA} kode ${dataBawahan.kodeSKP}`)
  let post = {
    type: "POST",
    url: "/e-kinerja2/v2/d_approve_skp/tabel_laporan_skp_kode",
    data: {
      KD_SKP: dataBawahan.kodeSKP,
      KD_TAHUN: that.thnSKP, 
      NIP: dataBawahan.NIP_18
    }
  }
  let skpBawahan = await that.evalTimedOut({
    evalFunc: [async post => {
      let el = document.getElementById('report_tabel_laporan_skp')
      if(!el){
        el = document.createElement('div')
        el.id = 'report_tabel_laporan_skp'
        document.body.appendChild(el)
      }
      el.innerHTML = await $.ajax(post)
      return [...document.getElementById('tabel_d_kegiatan_tahun').querySelectorAll('tr')].reduce((accRow, row) => {
        let o = [...row.querySelectorAll('td')].reduce((acc, td, i) => {
          td.textContent ? acc[Object.keys(acc)[i]] = td.textContent : null
          return acc
        }, {
          kodeKegSKP: null,
          thnSKP: null,
          kegSKP: null,
          tgtKuantitas: null,
          tgtWaktu: null,
          status: null
        })
        if(o.kodeKegSKP){
          accRow.push(o)
        }
        return accRow
      }, [])
    }, post]
  })
  // that.spinner.succeed(`${skpBawahan.length} keg SKP ${that.thnSKP} ${dataBawahan.NAMA}`)
  
  return skpBawahan.map( e=> Object.assign({}, dataBawahan, e))

}