exports._getKegBulan = async ({ that, a }) => {
  let bln = `${that.tgl[a].bln} ${that.tgl[a].thn}`
  that.spinner.start(`get keg bulan ${bln}`)
  that.kegBulan = await that.evalTimedOut({
    evalFunc: [async bln => {
      let response = await $.ajax({
        type: "POST",
        url: "/e-kinerja/v1/d_kegiatan_bulan/tabel_d_kegiatan_bulan"
      })
      let el = document.getElementById('report_tabel_d_kegiatan_bulan')
      if(!el){
        el = document.querySelector('div')
        el.insertAdjacentHTML('afterend', response)
      } else {
        el.innerHTML = response
      }
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
          act: act.split('').reduce((a, i) => (a += i).split('\n').join('').split('  ').join(' '), ''),
        }
      }).filter( e => e.bln && e.bln === bln )
      return rows
    }, bln ]
  })
  that.spinner.succeed(`${that.kegBulan.length} kegiatan bulanan`)
}