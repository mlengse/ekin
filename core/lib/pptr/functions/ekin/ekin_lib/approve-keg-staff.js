exports._approveKegStaff = async ({ that, a, i }) => {
  let { tglLength, tglLengthReal, tglSum, blnNum, thn } = that.tgl[a]
  let max = 8500
  if(that.users[i].kabeh){
    max = false
  }
  that.spinner.start('approveKegStaff')
  let indexNIPs = that.users[i].dataBawahan.map(({NIP_18}) => NIP_18 )

  let arr = []
  if(that.filteredTamsil.length){
    arr = that.filteredTamsil
  }
  
  if(that.users[i].kabeh){
    arr = that.tamsil
  }

  for(tamsil of arr){
    // console.log(tamsil)

    let maxPoin = max ? Math.round(max*( a == 0 ? (tglLengthReal < 20 ? (tglLength/tglSum) : 1 ) : 1 )) : false

    if(!tamsil.nip){
      tamsil.nip = tamsil.NIP_18
    }

    let existsIndex = indexNIPs.indexOf(tamsil.nip)
    let poin = 0

    if(tamsil.poin){
      poin = Number(tamsil.poin.split('POIN').join('').trim())
    }
  
    let dataBawahan = Object.assign({}, that.users[i].dataBawahan[existsIndex], tamsil, {
      poin,
      persen: tamsil.kinerjaPersen ? Number(parseFloat(tamsil.kinerjaPersen)/100) : 0
    })

    if( (max && poin < maxPoin) || !max) {


      let acts = await that.rebootIfErr(that.getLaporanRealisasi, {dataBawahan, blnNum, thn})
      while(!Object.keys(acts).length ) {
        that.spinner.start('reload getLaporanRealisasi and getDataApprovalBawahan')
        acts = await that.rebootIfErr(that.getLaporanRealisasi, {dataBawahan, blnNum, thn})
      }

      if(typeof acts !== 'string') {
        // console.log(acts)
        let actsArr = {}

        while(!Array.isArray(actsArr)){
          actsArr = await that.rebootIfErr(that.getDataApprovalBawahan, {acts, dataBawahan, i, a})
        }
  
        while(actsArr.length && ( (max && poin < maxPoin) || !max)) {
          let act = actsArr.shift()
          poin = await that.rebootIfErr(that.approve, { act, poin })
        }
  
      }


    }
  }
}