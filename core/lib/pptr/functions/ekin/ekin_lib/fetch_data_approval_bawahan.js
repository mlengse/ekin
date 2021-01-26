// const { _evalTimedOut } = require("../../..")

exports._getDataApprovalBawahan = async ({that, acts, dataBawahan, i, a}) => {
  if(Object.keys(acts).length) {
    that.spinner.start(`fetch data approval dari ${Object.keys(acts).length} laporan realisasi ${dataBawahan.NAMA}`)

    // console.log(that.users[i].dataBawahanObj[dataBawahan.NIP_18])
    if(!that.dataBawahanObj || (that.dataBawahanObj && !that.dataBawahanObj[dataBawahan.NIP_18])){
      await that.getDataBawahan()
    }

    let approval
    
    if(that.dataBawahanObj && that.dataBawahanObj[dataBawahan.NIP_18]){
      approval = that.dataBawahanObj[dataBawahan.NIP_18].approval

    }

    let actsArr = Object.keys(acts).map(e => acts[e]).filter( e => e.stat && e.stat.toLowerCase().includes('belum'))

    // if(acts[Object.keys(acts)[0]]) {
    //   console.log(acts[Object.keys(acts)[0]])
    // }

    that.spinner.succeed(`${actsArr.length} belum diapprove dari ${Object.keys(acts).length} realisasi kegiatan ${dataBawahan.NAMA}`)
    
    if(dataBawahan.NAMA.toLowerCase().includes('rini setyowati')) {
      that.spinner.info(`${dataBawahan.NAMA} hold`)
      return []
    }

    return actsArr
  }

  return acts


}
