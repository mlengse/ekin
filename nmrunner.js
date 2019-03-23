const Nightmare = require('nightmare');
module.exports = {
  getEkin,
  getPresensi
}

function getPresensi() {
  return new Nightmare({
    show: false,
    width: 1900,
    //gotoTimeout: 300000,
    webPreferences: {
      partition: "persist:presensi",
      zoomFactor: 0.75,
      image: false
    }
  });
}


function getEkin() {
  return new Nightmare({
    show: false,
    width: 1900,
    //gotoTimeout: 300000,
    webPreferences: {
      partition: "persist:ekin",
      zoomFactor: 0.75,
      image: false
    },
  })
}
