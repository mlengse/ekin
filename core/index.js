let obj = require("fs").readdirSync(require("path").join(__dirname, "lib")).reduce(( obj, file ) => Object.assign({}, obj, require("./lib/" + file)), {})

module.exports = class Core {
  constructor(config) {
    this.config = config
    this.tgl = {}
    this.liburArr = []
    for( let func in obj) {
      if(func.includes('_')) {
        this[func.split('_').join('')] = async (...args) => await obj[func](Object.assign({}, ...args, {that: this }))
      } else {
        this[func] = obj[func]
      }
    }
  }

  async close(){
    this.spinner.stop()
    this.browser && await this.browser.close()
  }

  async syncTglLibur(){
    this.spinner.start('sync tanggal libur')
    for(let t in this.tgl){
      let liburArr = this.getLiburnasByThn(this.tgl[t].thn)
      if(!(liburArr && Array.isArray(liburArr) && liburArr.length)){
        liburArr = await this.scrapeLiburnas({ tahun: this.tgl[t].thn })
        for (let l of liburArr) {
          this.addLiburnas(l)
        }
      }

      let tglList = this.tgl[t].tglList.filter( e => this.isMasuk(this.moment(e, 'DD/MM/YYYY').format('YYYYMMDD')))
      this.tgl[t] = Object.assign({}, this.tgl[t], {
        tglList,
        tglLength: tglList.reduce((acc, i) => acc += 1, 0)
      })
    }

  }

  async init() {

    this.getTgl()
    this.getUser()
    this.getPlan()

    await this.browserInit()
    await this.syncTglLibur()

  }

  
}