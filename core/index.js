let obj = {}

const normalizedPath = require("path").join(__dirname, "lib");

require("fs").readdirSync(normalizedPath).forEach(function(file) {
  obj = Object.assign({}, obj, require("./lib/" + file));
});

module.exports = class Core {
  constructor(config) {
    this.config = config
    this.tgl = {}
    this.liburArr = []
  }

  async close(){
    this.browser && await this.browser.close()
  }

  async init() {
    for( let func in obj) {
      if(func.includes('_')) {
        this[func.split('_').join('')] = async (...args) => await obj[func](Object.assign({}, ...args, {that: this }))
      } else {
        this[func] = obj[func]
      }
    }

    this.getTgl()

    await Promise.all([
      this.getUser(),
      this.getPlan(),
      this.browserInit(),
    ])

    for(let a of this.nums) if( a == 0 || (a == -1 && this.tglSkrg < 5 )) {
      this.liburArr = this.getLiburnasByThn(this.tgl[a].thn)
      if(!(this.liburArr && Array.isArray(this.liburArr) && this.liburArr.length)){
        this.liburArr = await this.scrapeLiburnas({ tahun: this.tgl[a].thn })
        for (let l of this.liburArr) {
          this.addLiburnas(l)
        }
    
      }
    }
  }
  
}