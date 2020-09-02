exports._approveKegStaff = async ({ that, a, i }) => {
  let { tglLength, tglLengthReal, tglSum, blnNum, thn } = that.tgl[a]
  let max = 8500
  if(that.users[i].kabeh){
    max = false
  }
  that.spinner.start('approveKegStaff')
  // if( i === 'nur'){
    // max =7500
  // }
  let indexNIPs = that.users[i].dataBawahan.map(({NIP_18}) => NIP_18 )


  let arr = []
  if(that.filteredTamsil){
    arr = that.filteredTamsil
  } else {
    arr = that.users[i].dataBawahan
  }

  // let tamsil = arr[0] 

  for(tamsil of arr){
    // if(tamsil.nip === '197910062003122006') {
    //   max = 7900
    // } else {
    //   max = 8500
    // }

    let maxPoin = max ? Math.round(max*( a == 0 ? (tglLengthReal < 20 ? (tglLength/tglSum) : 1 ) : 1 )) : false
    // console.log(maxPoin)
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
      let acts = await that.getLaporanRealisasi({dataBawahan, blnNum, thn})
      while(!Object.keys(acts).length ) {
        that.spinner.start('reload getLaporanRealisasi and getDataApprovalBawahan')
        acts = await that.getLaporanRealisasi({dataBawahan, blnNum, thn})
      }

      if(typeof acts !== 'string') {
        let actsArr = {}

        while(!Array.isArray(actsArr)){
          actsArr = await that.getDataApprovalBawahan({acts, dataBawahan, i})
        }
  
        while(actsArr.length && ( (max && poin < maxPoin) || !max)) {
          let act = actsArr.shift()
          poin = await that.approve({ act, poin })
        }
  
      }

      // console.log(acts)

    }
  }
}