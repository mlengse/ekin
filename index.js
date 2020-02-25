const { schedule } = require('node-cron')
const runner = require('./runner')
schedule('10 15 * * *', async () => {
	try{
		await runner()
	}catch(err){
		console.log(err)
	} 
})