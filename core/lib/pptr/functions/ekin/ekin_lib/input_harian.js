exports._inputHarian = async ({ that, a, i }) => {
  let tglObj = that.tgl[a]
  let bln = Number(tglObj.blnNum)
  let maxPoin = Math.round(8500*( a == 0 ? (tglObj.tglLength < 20 ? (tglObj.tglLength/tglObj.tglSum) : 1 ) : 1 ))
  let kegBlnBefore = 0
  let kegBlnAfter = 0
  for(let p in that.plans) {
    let plan = that.plans[p]
    let kegThn = that.kegTahun.filter(({nmKeg}) => nmKeg === plan.kegiatan)
    let kegBln = that.kegBulan.filter(({nmKeg}) => nmKeg === plan.kegiatan)
    if(plan[bln] && kegThn.length ) {
      if(!kegBln.length) {
        that.spinner.start(`input keg bln kuant ${plan[bln]} ${plan.kegiatan}`)
        await that.inputBln({
          act: kegThn[0].act,
          blnNum: tglObj.blnNum,
          kuant: plan[bln]
        })
        that.spinner.succeed(`keg bln kuant ${plan[bln]} ${plan.kegiatan}`)
        kegBln = that.kegBulan.filter(({nmKeg}) => nmKeg === plan.kegiatan)
        kegBlnAfter += 1
      } else {
        kegBlnBefore += 1
        kegBlnAfter += 1
      }
    }
  }

  if(kegBlnAfter > kegBlnBefore) { await that.getKegBulan({ a }) }


  for(let p in that.plans) {
    let plan = that.plans[p]
    let kegThn = that.kegTahun.filter(({nmKeg}) => nmKeg === plan.kegiatan)
    let kegBln = that.kegBulan.filter(({nmKeg}) => nmKeg === plan.kegiatan)
    if(plan[bln] && kegThn.length ) {
      if(kegBln[0].tgtKuant > 1 ) {
        for(let tgl of tglObj.tglList) {
          let actvs = that.getAktivitas().filter( ({NM_AKTIVITAS}) => NM_AKTIVITAS.toLowerCase() === plan.aktivitas.toLowerCase())[0]
          let tglSum = tglObj.tglSum
          let tglLength = tglObj.tglLength
          let jmlInp = Math.ceil(kegBln[0].tgtKuant / (tglSum - tglLength)).toFixed()
          // console.log(tgl, tglLength, kegBln[0].tgtKuant, jmlInp)
          // console.log(that.tgl)
          let keg = Object.assign({}, kegBln[0], actvs, {
            nip: that.users[i].username,
            tgl, 
            tglLength, 
            jmlInp
          })
          let kegExist = that.realKeg.filter( ({tgl, nmKeg}) => tgl === keg.tgl && keg.nmKeg === nmKeg)
          that.totalPoin < maxPoin && !kegExist.length && await that.inputKegiatan({ keg })
        }
      }
    }
  }

}
