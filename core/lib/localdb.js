const FileSync = require('lowdb/adapters/FileSync')
const liburnas = require('lowdb')(new FileSync('./db/liburnas.json'))
const set_aktivitas = require('lowdb')(new FileSync('./db/set_aktivitas.json'))
const data_bulan = require('lowdb')(new FileSync('./db/data_bulan.json'))
liburnas.defaults({ liburnas: [] }).write()    
set_aktivitas.defaults({ set_aktivitas: [] }).write()    
data_bulan.defaults({ data_bulan: [] }).write()    

exports.addLiburnas = (obj) => liburnas.get('liburnas').push(obj).write()
exports.addDataBulan = (obj) => data_bulan.get('data_bulan').push(obj).write()
exports.addSetAktivitas = (obj) => set_aktivitas.get('set_aktivitas').push(obj).write()
exports.getDataBulan = () => data_bulan.get('data_bulan').value()
exports.getAktivitas = () => set_aktivitas.get('set_aktivitas').value()
exports.getLiburnasByThn = (tahun) => liburnas.get('liburnas').filter({ tahun }).value()
exports.isMasuk = id => !liburnas.get('liburnas').filter({ id }).value().length

