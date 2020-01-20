exports._getKdSKP = async ({ that }) => {
  if(!that.kdSKP) {
    that.spinner.start('get kode skp')
    that.kdSKP = await that.page.evaluate(async () => {
      document.open();
      document.write(await (await fetch('/e-kinerja/v1/d_kegiatan_bulan', {
        headers: { "Content-Type": "text/html; charset=UTF-8" },
        credentials: 'same-origin',
      })).text());
      document.close();
      // document.querySelector('div').insertAdjacentHTML('afterend', )
      return document.getElementById('KD_SKP').value
    })
    that.spinner.succeed(`kd skp: ${that.kdSKP}`)
  }
  return that.kdSKP
}