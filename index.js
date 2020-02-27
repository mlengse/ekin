const { schedule } = require('node-cron')
const runner = require('./runner')
schedule('43 8 * * *', async () => {
	try{
		await runner()
	}catch(err){
		console.log(err)
	} 
})