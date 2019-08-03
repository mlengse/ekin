const csv = require('csv-parser');
const fs = require('fs');


module.exports = async () => {
  let lists = []

  await new Promise( resolve => fs.createReadStream('./jfu.csv')
    .pipe(csv({ separator: ';'}))
    .on('data', (row) => {
      //console.log(row);
      if(row.NIP !== ''){
        lists.push(row)

      }
      
    })
    .on('end', () => {
      console.log('CSV file successfully processed');
      resolve()
    })
  )
  return lists
}