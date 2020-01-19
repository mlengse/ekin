exports.pptr = require('puppeteer-core')
exports.spinner = require('ora')({
  stream: process.stdout
});

const normalizedPath = require("path").join(__dirname, "functions");

let obj = {}

require("fs").readdirSync(normalizedPath).forEach(function(file) {
  obj = Object.assign({}, obj, require("./functions/" + file));
});

for(let i in obj){
  exports[i] = obj[i]
}

exports._browserInit = async ({ that }) => {
  that.spinner.start('launch browser')
  that.browser = await that.pptr.launch(that.config.pptrOpt);
  that.pages = await that.browser.pages()
  that.page = that.pages[0]
  await that.page.goto(that.config.EKIN_URL, that.waitOpt)
  that.spinner.succeed()
}
