const { schedule } = require('node-cron')
const runner = require('./runner')
schedule('33 10 * * *', async () => await runner())