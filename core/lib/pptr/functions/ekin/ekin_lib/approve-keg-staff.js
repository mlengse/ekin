exports._approveKegStaff = async ({ that, a, i }) => {
  let { tglLength, tglSum, blnNum, thn } = that.tgl[a]
  let maxPoin = Math.round(8500*( a == 0 ? (tglLength < 20 ? (tglLength/tglSum) : 1 ) : 1 ))
  let indexNIPs = that.users[i].dataBawahan.map(({NIP_18}) => NIP_18 )
  for(tamsil of that.filteredTamsil){
    let existsIndex = indexNIPs.indexOf(tamsil.nip)
    let poin = Number(tamsil.poin.split('POIN').join('').trim())
    let dataBawahan = Object.assign({}, that.users[i].dataBawahan[existsIndex], tamsil, {
      poin,
      persen: Number(parseFloat(tamsil.kinerjaPersen)/100)
    })
    if(poin < maxPoin) {
      let acts = await that.getLaporanRealisasi({dataBawahan, blnNum, thn})
      acts = await that.getDataApprovalBawahan({acts, dataBawahan})
      while(Array.isArray(acts) && acts.length && poin < maxPoin) {
        let act = acts.shift()
        poin = await that.approve({ act, poin })
      }
    }
  }
}