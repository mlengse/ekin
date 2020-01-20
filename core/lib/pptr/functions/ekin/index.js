exports.getParams = obj => Object.entries(obj).map(([key, val]) => `${key}=${val}`).join('&')
let obj = require("fs").readdirSync(require("path").join(__dirname, 'ekin_lib')).reduce(( obj, file ) => Object.assign({}, obj, require("./ekin_lib/" + file)), {})
for( let o in obj) exports[o] = obj[o]