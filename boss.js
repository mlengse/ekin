const csv = require('csv-parser');
const fs = require('fs');
// const ekinList = require('./ekinList')

module.exports = async () => {
  let lists = []

  await new Promise( resolve => fs.createReadStream('./all.csv')
    .pipe(csv({ separator: ';'}))
    .on('data', async (row) => {
      // console.log(row); 
      lists.push(row)
      // let a = await ekinList(row.nama)
      // console.log(a)
    })
    .on('end', () => {
      console.log('CSV file successfully processed');
      resolve()
    })
  )
  return lists
}