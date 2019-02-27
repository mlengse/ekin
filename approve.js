const { approving } = require('./ekin')

;(async () => {
  try {
    const { ekin } = await approving()
    await ekin.end()
  } catch (err) {
    console.log(err)
  }
})()
