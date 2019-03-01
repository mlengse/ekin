const Nightmare = require('nightmare');
module.exports = {
  getEkin,
}

function getEkin() {
  return new Nightmare({
    show: true,
    width: 1900,
    //gotoTimeout: 300000,
    webPreferences: {
      partition: "persist:ekin",
      zoomFactor: 0.75,
      image: false
    },
  })
}