require('dotenv').config()
const moment = require('moment')
const lists = require('./ekinList')
const { 
  ekinLoginKepala,
  approving } = require('./ekin')
moment.locale('id')

const getTgl = async (num) => {
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
    while (startOfMonth.isBefore(now)) {
      if (now.day() !== 0) {
        tglList.push(now.format('DD MM YYYY'))
      }
      now = now.clone().add(-1, 'day')
    }
    now = endOfMonth
    while (startOfMonth.isBefore(now)) {
      if (now.day() !== 0) {
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

    for (a of [ 0/*, -1, -2, -3, -4*/]) {
      for(let list of await lists()) {
        console.log(list.NIP)

        let username = list.NIP

        const { bln } = await getTgl(a)

          let blnOnly = moment(bln, 'MMMM YYYY').format('MMMM')

          let { ekin } = await ekinLoginKepala()

          console.log(blnOnly)

          await approving(ekin, username, blnOnly)
          await ekin.end()

      }


    }
  } catch (err) {
    console.log(err)
  }
})()
