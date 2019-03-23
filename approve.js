const moment = require('moment')
const { approving } = require('./ekin')
const lists = require("./ekinList");
moment.locale('id')
const bln = moment().format('MMMM')
;(async () => {
  try {
    for(let list of await lists()){
      console.log(list)
      await approving(list.NIP, bln)

    }
  } catch (err) {
    console.log(err)
  }
})()
