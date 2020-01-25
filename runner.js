if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config()
}
const Core = require('./core')
const config = require('./config')

const ekin = new Core(config)

module.exports = async () => {
  try {
    await ekin.init()
    for(let a of ekin.nums) if( a == 0 || (a == -1 && ekin.tglSkrg < 5 )) {
      for( let i in ekin.users) {
        await ekin.login( ekin.users[i] )
        if( i === 'anjang') {
          await ekin.getKdSKP()
          await ekin.getKegTahun()
          await ekin.getKegBulan({ bln: `${ekin.tgl[a].bln} ${ekin.tgl[a].thn}` })
          await ekin.fetchRealKeg({ tgl: ekin.tgl[a].tglList[0] })
          await ekin.inputHarian({ a, i })
        }
        if( a == 0 
          || ( a == -1 
            && ((Number(ekin.moment().format('DD')) < 7 ) && ( nama === 'yuni' || nama === 'anjang' || nama === 'wagimin')) 
            || ((Number(ekin.moment().format('DD')) < 3 ) && ( nama !== 'yuni' && nama !== 'anjang' && nama !== 'wagimin'))
          )) {
            await ekin.getDataBawahan()
            let { tglLength, tglSum, blnNum, thn } = ekin.tgl[a]
            await ekin.getLaporanTamsil({blnNum, thn})
            let maxPoin = Math.round(8500*( a == 0 ? (tglLength < 20 ? (tglLength/tglSum) : 1 ) : 1 ))
            let indexNIPs = ekin.users[ekin.user.nama].dataBawahan.map(({NIP_18}) => NIP_18 )
  
            for(tamsil of ekin.filteredTamsil){
              let existsIndex = indexNIPs.indexOf(tamsil.nip)
              let dataBawahan = Object.assign({}, ekin.users[ekin.user.nama].dataBawahan[existsIndex], tamsil, {
                poin: Number(tamsil.poin.split('POIN').join('').trim()),
                persen: Number(parseFloat(tamsil.kinerjaPersen)/100)
              })

              let poin = dataBawahan.poin

              if(poin < maxPoin) {
                let acts = await ekin.getLaporanRealisasi({dataBawahan, blnNum, thn})

                acts = await ekin.getDataApprovalBawahan({acts, dataBawahan})

                while(Array.isArray(acts) && acts.length && poin < maxPoin) {
                  let act = acts.shift()
                  poin = await ekin.approve({ act, poin })
                }
  
              }
          
            }
  
          }

      }
    }
    await ekin.close()
  }catch(e){
    console.error(e)
    await ekin.close()
  }
}