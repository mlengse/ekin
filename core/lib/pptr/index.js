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
  // await that.page.setRequestInterception(true);
  // const block_ressources = ['image', 'stylesheet', 'media', 'font', 'texttrack', 'object', 'beacon', 'csp_report', 'imageset'];
  // that.page.on('request', request => {
  //   // console.log(request)
  //   if (
  //     block_ressources.indexOf(request.resourceType) > -1
  //     // Be careful with above
  //     || request._url.includes('.jpg')
  //     || request._url.includes('.jpeg')
  //     || request._url.includes('.png')
  //     || request._url.includes('.gif')
  //     || request._url.includes('.css')
  //   )
  //     request.abort();
  //   else
  //     request.continue();
  // })
  await that.page.goto(that.config.EKIN_URL, that.config.waitOpt)
  that.spinner.succeed()
}
