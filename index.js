const { schedule } = require('node-cron')
const approve = require('./new')
schedule('10 14 * * 1-6', async () => {
    try{
        await approve()
    }catch(err){
        console.log(err)
    } 
})