const { schedule } = require('node-cron')
const runner = require('./runner')
// schedule('*/30 * * * *', async () => await runner())
schedule('33 5,11,16 * * *', async () => await runner())