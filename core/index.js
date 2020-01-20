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

  async init() {

    this.getTgl()
    this.getUser()
    this.getPlan()

    await Promise.all([
      this.browserInit(),
    ])

    this.liburArr = this.getLiburnasByThn(this.tgl[0].thn)
    if(!(this.liburArr && Array.isArray(this.liburArr) && this.liburArr.length)){
      this.liburArr = await this.scrapeLiburnas({ tahun: this.tgl[0].thn })
      for (let l of this.liburArr) {
        this.addLiburnas(l)
      }
  
    }
  }
  
}