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

  getKualitasRand(){
    return 86 + Math.floor(Math.random() * ( 96 - 86 ))
  }

  async rebootIfErr(procc, arrgs) {
    try {
      return await procc(arrgs)
    } catch(e) {
      console.error(JSON.stringify(e))
      console.error(`process error: ${new Date()}`)
      return await procc(arrgs)
    }

  }

  async close(isPM2){
    this.spinner.stop()
    // if(this.page) {
    //   await this.page.close()
    // }
    if(!isPM2){
      await this.browser.close()
    } else {
      if(this.browser.isConnected()) {
        await this.browser.disconnect()
      }
    } 
    console.log(`process done: ${new Date()}`)
  }

  async init() {

    this.getTgl()
    this.getUser()
    this.getPlan()

    await this.browserInit()
    await this.syncTglLibur()
  }
}