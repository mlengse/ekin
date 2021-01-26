exports._fetchSKPStaff = async({ that, dataBawahan}) => {
  that.spinner.start(`fetch SKP ${that.thnSKP} ${dataBawahan.NAMA}`)

  let post = {
    type: "POST",
    url: "/e-kinerja2/v2/d_approve_skp/daftar_skp_tahun",
    data: {
      KD_TAHUN: that.thnSKP, 
      NIP: dataBawahan.NIP_18
    }
  }
  let skpBawahan = await that.evalTimedOut({
    evalFunc: [async post => {
      let el = document.getElementById('report_tabel_daftar_skp')
      if(!el){
        el = document.createElement('div')
        el.id = 'report_tabel_daftar_skp'
        document.body.appendChild(el)
      }
      el.innerHTML = await $.ajax(post)
      return [...document.getElementById('tabel_daftar_skp').querySelectorAll('tr')].reduce((accRow, row) => {
        let o = [...row.querySelectorAll('td')].reduce((acc, td, i) => {
          td.textContent ? acc[Object.keys(acc)[i]] = td.textContent : null
          return acc
        }, {
          no: null,
          kodeSKP: null,
          NAMA: null,
          tahun: null,
          status: null
        })
        if(o.kodeSKP){
          accRow.push(o)
        }
        return accRow
      }, [])
    }, post]
  })
  // that.spinner.succeed(`kode SKP ${skpBawahan[0].kodeSKP} a.n. ${dataBawahan.NAMA} thn ${that.thnSKP}`)
  
  return skpBawahan.map( e=> Object.assign({}, dataBawahan, e))

}