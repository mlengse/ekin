exports._getSatker = async ({that}) => {
  that.spinner.start('fetch satuan kerja')
  that.satker = await that.evalTimedOut({
    evalFunc: [async ()=> {
      let response = await fetch('/e-kinerja/v1/laporan_realisasi_pegawai', {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",                                                                                                
          },
        credentials: 'same-origin',
      })
  
      let wrapper = document.querySelector('div')
      wrapper.insertAdjacentHTML('afterend', await response.text())
  
      return document.getElementById('KD_SATKER').value
    }]
  })
  // that.spinner.succeed(`satker: ${that.satker}`)
  // return that.satker
}
