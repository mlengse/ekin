exports.pptr = require('puppeteer-core')
// exports.pptr = require('puppeteer-extra')
exports.spinner = require('ora')({
  stream: process.stdout
});
exports._browserInit = async ({ that }) => {
  that.spinner.start('launch browser')
  // that.pptr.use(require('puppeteer-extra-plugin-stealth')())
  that.browser = await that.pptr.launch(that.config.pptrOpt);
  that.pages = await that.browser.pages()
  // that.spinner.succeed()
}
let funcs = require("fs").readdirSync(require("path").join(__dirname, "functions")).reduce(( obj, file ) => Object.assign({}, obj, require("./functions/" + file)), {})
for(let fu in funcs) exports[fu] = funcs[fu]
