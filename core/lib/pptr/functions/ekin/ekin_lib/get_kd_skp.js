exports._getKdSKP = async ({ that }) => {
  // if(!that.kdSKP) {
    that.spinner.start('get kode skp')
    that.kdSKP = await that.evalTimedOut({
      evalFunc: [async () => {
        document.querySelector('div').insertAdjacentHTML('afterend', await (await fetch('/e-kinerja2/v2/d_kegiatan_bulan', {
          headers: { "Content-Type": "text/html; charset=UTF-8" },
          credentials: 'same-origin',
        })).text())
        return document.getElementById('KD_SKP').value
      }]
    })
    that.spinner.succeed(`kd skp: ${that.kdSKP}`)
  // }
  return that.kdSKP
}