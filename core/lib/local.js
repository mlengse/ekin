const csv = require('csv-parser');
const fs = require('fs');

exports.plans = {}
exports.users = {}
// exports.getPlan = () => {
//   return new Promise( resolve => fs.createReadStream('./db/rencana.csv')
//   .pipe(csv({ separator: ','}))
//   .on('data', async row => {
//     for(let pr in row) if(!row[pr].length) delete row[pr]
//     if(!this.plans[row.no]){
//       this.plans[row.no] = row
//     } 
//   })
//   .on('end', () => resolve(Object.keys(this.plans).map( no => this.plans[no]))))
// 
// }

exports.getUser = () => {
  return new Promise( resolve => fs.createReadStream('./db/user.csv')
  .pipe(csv({ separator: ';'}))
  .on('data', async (row) => {
    if(!this.users[row.nama]){
      this.users[row.nama] = Object.assign({}, row, {
        input: (row.input === 'true'),
        early: (row.early === 'true')
      })
    } 
  })
  .on('end', () => resolve(Object.keys(this.users).map( nama => this.users[nama]))))

}