const { schedule } = require('node-cron')
const approve = require('./new')
schedule('10 18 * * *', async () => {
    try{
        await approve()
    }catch(err){
        console.log(err)
    } 
})