exports._getKegTahun = async({ that }) => {
  that.spinner.start(`get keg tahun ${that.kdSKP}`)
  that.kegTahun = await that.page.evaluate(async KD_SKP => {
    let response = await $.ajax({
      type: "POST",
      url: "/e-kinerja/v1/d_kegiatan_bulan/tabel_d_kegiatan_tahun",
      data: { KD_SKP }
    })
    let el = document.getElementById('report_tabel_d_kegiatan_tahun')
    if(!el) {
      el = document.querySelector('div')
      el.insertAdjacentHTML('afterend', response)
    } else {
      el.innerHTML = response
    }
    let rows = [...document.getElementById('tabel_d_kegiatan_tahun').querySelectorAll('tr')].map( row => {
      let tabs = [...row.querySelectorAll('td')]
      if( !tabs[0]) {
        return {}
      }
      let act = tabs[6].getAttribute('ontouchstart')
      return {
        kdKeg: tabs[0].textContent,
        nmKeg: tabs[1].textContent,
        tgtKuant: Number(tabs[3].textContent),
        tgtWkt: tabs[4].textContent,
        status: tabs[5].textContent,
        act: act.split('').reduce((a, i) => (a += i).split('\n').join('').split('  ').join(' '), ''),
      }
    }).filter( e => e.kdKeg )
    return rows
  }, that.kdSKP )
  that.spinner.succeed(`${that.kegTahun.length} kegiatan tahunan`)
}