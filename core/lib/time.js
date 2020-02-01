const moment = require('moment')
moment.locale('id')
exports.thnSKP = moment().add(-1, 'year').format('YYYY')
exports.isApproveSKP = moment().add(-1, 'month').format('YYYY') === moment().add(-1, 'year').format('YYYY')
exports.getDateString1 = e => moment(e, 'DD/MM/YYYY').format('YYYYMMDD')
exports._syncTglLibur =  async ({that}) => {
  that.spinner.start('sync tanggal libur')
  for(let t in that.tgl){
    let liburArr = that.getLiburnasByThn(that.tgl[t].thn)
    if(!(liburArr && Array.isArray(liburArr) && liburArr.length)){
      liburArr = await that.scrapeLiburnas({ tahun: that.tgl[t].thn })
      for (let l of liburArr) {
        that.addLiburnas(l)
      }
    }

    let tglList = that.tgl[t].tglList.filter( e => that.isMasuk( that.getDateString1(e)))
    that.tgl[t] = Object.assign({}, that.tgl[t], {
      tglList,
      tglLength: tglList.reduce((acc, i) => acc += 1, 0)
    })
  }
}
exports.tglSkrg = Number(moment().format('DD'))
exports.thnSkrg = Number(moment().format('YYYY'))
exports.nums = [-1, 0]
exports.tgl = {}
exports.getTgl = () => {
  for(let num of this.nums ) {
    let now = moment()
    let bln = moment().add(num, 'month').format('MMMM')
    let blnNum = moment().add(num, 'month').format('MM')
    const startOfMonth = moment().add(num, 'month').startOf('month')
    let endOfMonth = moment().add(num, 'month').endOf('month')
    let tglList = []
    let tglLength = 0
    if (endOfMonth.isBefore(now)){
      now = endOfMonth
    }
    while (startOfMonth.isBefore(now)) {
      if (now.day() !== 0) {
        tglList.push(now.format('DD/MM/YYYY'))
        tglLength++
      }
      now = now.clone().add(-1, 'day')
    }
    now = endOfMonth
    if(bln === 'November'){
      bln = 'Nopember'
    }
    this.tgl[num] = {
      tglList,
      tglLength,
      tglSum: startOfMonth.daysInMonth(),
      bln: bln.toUpperCase(),
      blnNum,
      thn: startOfMonth.format('YYYY')
    }
  }

  return this.tgl

}