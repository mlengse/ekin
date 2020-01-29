exports._inputHarian = async ({ that, a, i }) => {
  let tglObj = that.tgl[a]
  let bln = Number(tglObj.blnNum)
  let maxPoin = Math.round(8500*( a == 0 ? (tglObj.tglLength < 20 ? (tglObj.tglLength/tglObj.tglSum) : 1 ) : 1 ))
  for(let p in that.plans) {
    let plan = that.plans[p]
    let kegThn = that.kegTahun.filter(({nmKeg}) => nmKeg === plan.kegiatan)
    let kegBln = that.kegBulan.filter(({nmKeg}) => nmKeg === plan.kegiatan)
    if(plan[bln] && kegThn.length ) {
      if(!kegBln.length) {
        await that.inputBln({
          act: kegThn[0].act,
          blnNum: tglObj.blnNum,
          kuant: plan[bln]
        })
        // await that.getKegBulan({ 
        //   a
        //   // bln: `${tglObj.bln} ${tglObj.thn}` 
        // })
        kegBln = that.kegBulan.filter(({nmKeg}) => nmKeg === plan.kegiatan)
      }
    }
  }
  await that.getKegBulan({ 
    a
    // bln: `${tglObj.bln} ${tglObj.thn}` 
  })

  for(let p in that.plans) {
    let plan = that.plans[p]
    let kegThn = that.kegTahun.filter(({nmKeg}) => nmKeg === plan.kegiatan)
    let kegBln = that.kegBulan.filter(({nmKeg}) => nmKeg === plan.kegiatan)
    if(plan[bln] && kegThn.length ) {
      if(kegBln[0].tgtKuant > 1 ) {
        for(let tgl of tglObj.tglList) {
          let actvs = that.getAktivitas().filter( ({NM_AKTIVITAS}) => NM_AKTIVITAS.toLowerCase() === plan.aktivitas.toLowerCase())[0]
          let keg = Object.assign({}, kegBln[0], actvs, {
            nip: that.users[i].username,
            tgl, 
            tglLength: tglObj.tglLength, 
            jmlInp: Math.ceil(kegBln[0].tgtKuant / tglObj.tglLength).toFixed()
          })
          let kegExist = that.realKeg.filter( ({tgl, nmKeg}) => tgl === keg.tgl && keg.nmKeg === nmKeg)
          that.totalPoin < maxPoin && !kegExist.length && await that.inputKegiatan({ keg })
        }
      }
    }
  }

}
