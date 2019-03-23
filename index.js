require('dotenv').config()
const { schedule } = require('node-cron')
const moment = require('moment')
const inputKonseling = require('./all')
const cron = process.env.CRON
schedule(cron, () => {
    console.log('input ekin & presensi')
    console.log(moment().format('LLLL'))
    inputKonseling()
})