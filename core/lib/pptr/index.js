const delay = require('delay')
exports.pptr = require('puppeteer')
exports.spinner = require('ora')({
  stream: process.stdout
});
exports._browserInit = async ({ that }) => {

  if(that.browser) {
    while(that.browser.isConnected()){
      that.spinner.start('a process is running')
      await delay(60000)
    }
  } else {
    that.spinner.start('launch browser')
    that.browser = await that.pptr.launch(that.config.pptrOpt);
    that.browserWSEndpoint = that.browser.wsEndpoint();
  }

  that.spinner.start('connect browser')
  that.browser = await that.pptr.connect({browserWSEndpoint: that.browserWSEndpoint});
  that.pages = await that.browser.pages()
}
let funcs = require("fs").readdirSync(require("path").join(__dirname, "functions")).reduce(( obj, file ) => Object.assign({}, obj, require("./functions/" + file)), {})
for(let fu in funcs) exports[fu] = funcs[fu]
