const { schedule } = require('node-cron')
const runner = require('./runner')
// schedule('*/30 * * * *', async () => await runner())
schedule('33 6,15 * * *', async () => await runner())