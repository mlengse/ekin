const moment = require('moment')
moment.locale('id')

exports.moment = moment
exports.thnSKP = moment().add(-1, 'year').format('YYYY')
exports.isApproveSKP = moment().add(-10, 'day').format('YYYY') === moment().add(-1, 'year').format('YYYY')
exports.getDateString1 = e => moment(e, 'DD/MM/YYYY').format('YYYYMMDD')
exports.getDateString2 = e => moment(e, 'DD/MM/YYYY').format('YYYY-MM-DD')
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

let nums = [ -1, 0 ]
let now = Number(moment().format('MM'))
let t = 0
let a = Number(moment().add(t, 'month').format('MM'))

if( process.env.ALL ){
  while( a <= now ) {
    if(nums.indexOf(a-now) !== 0){
      nums.push(a-now)
    }
    t--
    a = Number(moment().add(t, 'month').format('MM'))
  }
}

// console.log(nums)

exports.nums = nums//.reverse()
exports.tgl = {}
exports.getTgl = () => {
  for(let num of this.nums ) {
    let now = moment()
    let bln = moment().add(num, 'month').format('MMMM')
    let blnNum = moment().add(num, 'month').format('MM')
    const startOfMonth = moment().add(num, 'month').startOf('month')
    let endOfMonth = moment().add(num, 'month').endOf('month')
    let tglList = []
    let blnLength = 0
    let tglLength = 0
    if (endOfMonth.isBefore(now)){
      now = endOfMonth
    }
    while(now.isBefore(endOfMonth)) {
      if (endOfMonth.day() !== 0) {
        blnLength++
      }
      endOfMonth = endOfMonth.add(-1, 'day')
    }
    while (startOfMonth.isBefore(now)) {
      if (now.day() !== 0) {
        tglList.push(now.format('DD/MM/YYYY'))
        tglLength++
        blnLength++
      }
      now = now.clone().add(-1, 'day')
    }
    // now = endOfMonth
    if(bln === 'November'){
      bln = 'Nopember'
    }
    this.tgl[num] = {
      tglList,
      blnLength,
      tglLengthReal: tglLength,
      tglLength,
      tglSum: startOfMonth.daysInMonth(),
      bln: bln.toUpperCase(),
      blnNum,
      thn: startOfMonth.format('YYYY')
    }
  }

  return this.tgl

}