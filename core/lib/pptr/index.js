const delay = require('delay')
const ora = require('ora')

exports.pptr = require('puppeteer')
exports.spinner =(process.platform === 'win32' && !process.env.NODE_APP_INSTANCE) ? ora({
  stream: process.stdout
}): {
  start: _ => '',
  stop: _ => '',
  succeed: text => console.log(text),
  warn: text => console.info(text),
  info: text => console.info(text),
  fail: text => console.error(text)
}
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
