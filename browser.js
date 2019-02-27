module.exports = {
  tableKegEval
}

function tableKegEval(tableId) {
  let table = document.getElementById(tableId.split('#').join(''))
  let tableBody = table.querySelectorAll('tbody > tr')
  let kegList = []
  for (let row of tableBody) {
    let keg = {
      act: row.getAttribute('ondblclick'),
      text: [],
      bln: '',
      keg: '',
      jml: '',
    }
    let tds = row.querySelectorAll('td')
    for (let col of tds) {
      keg.text.push(col.textContent.split('\n').join('').split('  ').join(''))
    }
    keg.bln = keg.text[0]
    keg.keg = keg.text[1]
    keg.jml = keg.text[2]
    kegList.push(keg)
  }
  return kegList
}