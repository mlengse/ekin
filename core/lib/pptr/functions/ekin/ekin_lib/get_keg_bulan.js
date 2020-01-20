exports._getKegBulan = async ({ that, bln }) => {
  that.spinner.start('get keg bulan')
  that.kegBulan = await that.page.evaluate( async bln => {
    document.getElementById('report_tabel_d_kegiatan_bulan').innerHTML = await $.ajax({
      type: "POST",
      url: "/e-kinerja/v1/d_kegiatan_bulan/tabel_d_kegiatan_bulan"
    })
    let rows = [...document.getElementById('tabel_d_kegiatan_bulan').querySelectorAll('tr')].map( row => {
      let tabs = [...row.querySelectorAll('td')]
      if( !tabs[0]) {
        return {}
      }
      let act = tabs[4].getAttribute('ontouchstart')
      return {
        bln: tabs[0].textContent,
        nmKeg: tabs[1].textContent,
        tgtKuant: Number(tabs[2].textContent),
        status: tabs[3].textContent,
        act//: act.slice(act.indexOf('(')+1, act.indexOf(')')).split("'").join('').split(','),
      }
    }).filter( e => e.bln && e.bln === bln )
    return rows
  }, bln )
  that.spinner.succeed(`${that.kegBulan.length} kegiatan bulanan`)
}