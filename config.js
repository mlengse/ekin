const {
  CHROME_PATH,
  USER_DATA_PATH,
} = process.env
let args = []
// console.log(process.platform)
if(process.platform === 'win32') {
  args = [
    '--content-shell-hide-toolbar',
    '--hide',
    '--hide-scrollbars',
    '--window-position=0,0',
    '--window-size=0,0'
  ]
} else {
  args = [
    '--headless'
  //   '--no-sandbox', 
  //   '--disable-setuid-sandbox', 
    // '--auto-open-devtools-for-tabs', 
    // '--disk-cache-dir=./tmp/browser-cache-disk' 
  ]
}

module.exports = Object.assign({}, 
  process.env, 
  {
    pptrOpt: {
      // headless: true,
      headless: false,
      executablePath: `${CHROME_PATH}`, 
      userDataDir: `${USER_DATA_PATH}`,
      args
    },
    waitOpt: {
      waitUntil: 'networkidle2'
    }
  })