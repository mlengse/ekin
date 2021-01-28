
exports._approve = async ({that, act, poin}) => {
  // console.log(act)
  let post = {
    method: 'POST',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",                                                                                                
     },
    credentials: 'same-origin',
    body: act.keg === 'utama' ? that.getParams({
      KD_REALISASI_KEGIATAN: act.kode,
      STATUS: 'S'
    }) : that.getParams({
      KD_KEGIATAN_TAMBAHAN: act.kode,
      STATUS: 'S'
    }),
  }

  let set = await that.page.evaluate(async (post, keg) => {
    let res = await fetch(`/e-kinerja2/v2/${keg === 'utama' ? 'd_approve_realisasi_kegiatan' : 'd_approve_kegiatan_tambahan'}/simpan`, post)
    let dat = await res.json()
    return {
      status: dat.status,
      body: dat
    }
  }, post, act.keg)
    let uraian = Object.keys(act).filter(e=> ['act', 'kode', 'stat', 'bulan', 'res', 'kuantitas', 'poin'].indexOf(e) === -1).map( e => (`, ${act[e]}`)).join('')
    that.spinner.start(`approve${uraian}`)
  // console.log(set)
  if(set.status){
    poin += act.poin
    that.spinner.succeed(`${set.body.msg}, total poin ${poin}${uraian}`)
  } else {
    that.spinner.fail(`${set.body.msg}, total poin ${poin}${uraian}`)
  }

  return poin
}
