require('dotenv').config()
const moment = require('moment')
const { approvingAll } = require('./ekin')
//const { query, aql } = require('./db')
moment.locale('id')

const getTgl = async (num) => {
  const thn = moment().format('YYYY')
  let now = moment()
  let bln = now.clone().add(num, 'month').format('MMMM')
  let blnNum = now.clone().add(num, 'month').format('MM')
  const startOfMonth = now.clone().add(num, 'month').startOf('month')
  let endOfMonth = now.clone().add(num, 'month').endOf('month')
  let tglList = []
  let tglLength = 0
  if (endOfMonth.isBefore(now)){
    now = endOfMonth
  }
  try {
 //   results = await query(aql`FOR l IN liburnas FILTER l.tahun == ${thn} RETURN l`)
 //   liburs = results.map(result => result.date)
    while (startOfMonth.isBefore(now)) {
      if (now.day() !== 0 /*&& liburs.indexOf(now.format('D MMMM YYYY')) < 0*/) {
        tglList.push(now.format('DD MM YYYY'))
      }
      now = now.clone().add(-1, 'day')
    }
    now = endOfMonth
    while (startOfMonth.isBefore(now)) {
      if (now.day() !== 0 /*&& liburs.indexOf(now.format('DD MMMM YYYY')) < 0*/) {
        tglLength++
      }
      now = now.clone().add(-1, 'day')
    }
    return {
      tglList,
      tglLength,
      bln,
      blnNum
    }
  } catch (err) {
    console.log(err)
  }
}

; (async () => {
  try {

    for (a of [-1/*, -2, -3, -4*/]) {
        const { bln } = await getTgl(a)
        let blnOnly = moment(bln, 'MMMM YYYY').format('MMMM')
        await approvingAll(blnOnly)
    }
  } catch (err) {
    console.log(err)
  }
})()
