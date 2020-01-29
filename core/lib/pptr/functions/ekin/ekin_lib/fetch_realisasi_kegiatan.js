exports._fetchRealKeg = async ({ that, a }) => {
  let tgl = that.tgl[a].tglList[0]
  that.spinner.start(`fetch realisasi keg hingga tgl ${tgl}`)
  that.realKeg = await that.page.evaluate( async tgl => {
    let reportReal = document.createElement('div')
    reportReal.id = "report_tabel_d_realisasi_kegiatan"
    document.body.appendChild(reportReal)
    document.getElementById('report_tabel_d_realisasi_kegiatan').innerHTML = await $.ajax({
      type: "POST",
      url: "/e-kinerja/v1/d_realisasi_kegiatan/tampil",
      data: {
        TGL_REALISASI: tgl,
        STATUS: "S"
      }
    })
    let rows = [...document.getElementById('tabel_d_realisasi_kegiatan').querySelectorAll('tr')].map( row => {
      let tabs = [...row.querySelectorAll('td')]
      if( !tabs[0]) {
        return {}
      }
      let act = tabs[5].getAttribute('ontouchstart')
      return {
        tgl: tabs[0].textContent,
        nmKeg: tabs[1].textContent,
        tgtKuant: Number(tabs[2].textContent),
        poin:Number(tabs[3].textContent),
        status: tabs[4].textContent,
        act: act && act.split('').reduce((a, i) => (a += i).split('\n').join('').split('  ').join(' '), ''),
      }
    }).filter( e => e.tgl /*&& e.tgl === tgl*/ )
    return rows
  }, tgl )
  // console.log(that.realKeg)
  that.totalPoin = that.realKeg.map(({poin}) => poin).reduce((ac, i) => i ? ac += i : ac, 0)
  that.spinner.succeed(`${that.realKeg.length} realisasi kegiatan dengan total poin ${that.totalPoin}`)
  // return that.realKeg
}