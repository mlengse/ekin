const FileSync = require('lowdb/adapters/FileSync')
const liburnas = require('lowdb')(new FileSync('./db/liburnas.json'))
liburnas.defaults({ liburnas: [] }).write()    
exports.addLiburnas = (obj) => liburnas.get('liburnas').push(obj).write()
exports.getLiburnasByThn = (tahun) => liburnas.get('liburnas').filter({ tahun }).value()
exports.isMasuk = id => !liburnas.get('liburnas').filter({ id }).value().length

const set_aktivitas = require('lowdb')(new FileSync('./db/set_aktivitas.json'))
set_aktivitas.defaults({ set_aktivitas: [] }).write()    
exports.addSetAktivitas = (obj) => set_aktivitas.get('set_aktivitas').push(obj).write()
exports.getAktivitas = () => set_aktivitas.get('set_aktivitas').value()

const data_bulan = require('lowdb')(new FileSync('./db/data_bulan.json'))
data_bulan.defaults({ data_bulan: [] }).write()    
exports.addDataBulan = (obj) => data_bulan.get('data_bulan').push(obj).write()
exports.getDataBulan = () => data_bulan.get('data_bulan').value()

const output = require('lowdb')(new FileSync('./db/output.json'))
output.defaults({ output: [] }).write()    
exports.addOutput = (obj) => output.get('output').push(obj).write()
exports.getOutput = () => output.get('output').value()


