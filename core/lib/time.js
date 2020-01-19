const moment = require('moment')
moment.locale('id')

exports.moment = moment
exports.tglSkrg = Number(moment().format('DD'))
exports.nums = [0, -1]
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
        tglList.push(now.format('DD MM YYYY'))
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