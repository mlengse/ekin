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
        if( a == 0 || 
	      	( a == -1 && 
	      		( (Number(ekin.moment().format('DD')) < 7 ) && 
              (
                nama === 'yuni' ||
                nama === 'anjang' ||
                nama === 'wagimin'
            )) ||
	      		( (Number(ekin.moment().format('DD')) < 3 ) && 
              (
                nama !== 'yuni' &&
	      			  nama !== 'anjang' &&
                nama !== 'wagimin'
            ))
          )) {
            let dataBawahan = await ekin.getDataBawahan()
            let { tglLength, tglSum, bln, blnNum, thn } = ekin.tgl[a]

            let maxPoin = Math.round(8500*( a == 0 ? (tglLength < 20 ? (tglLength/tglSum) : 1 ) : 1 ))
  
            let tamsils = await ekin.getLaporanTamsil({blnNum, thn})
  
            for(tamsil of tamsils){
              let indexNIPs = dataBawahan.map(({NIP_18}) => NIP_18 )
              let existsIndex = indexNIPs.indexOf(tamsil.nip)
              dataBawahan[existsIndex] = Object.assign({}, dataBawahan[existsIndex], tamsil, {
                poin: Number(tamsil.poin.split('POIN').join('').trim()),
                persen: Number(parseFloat(tamsil.kinerjaPersen)/100)
              })

              let poin = dataBawahan[existsIndex].poin

              if(poin < maxPoin) {
                ekin.spinner.start(`fetch laporan realisasi ${tamsil.nama}: ${tamsil.poin}`)
                let acts = await ekin.getLaporanRealisasi({nip: dataBawahan[existsIndex].NIP_18, blnNum, thn})

                if(Object.keys(acts).length) {
                  ekin.spinner.start(`fetch data approval dari ${Object.keys(acts).length} laporan realisasi`)
                  acts = await ekin.getDataApprovalBawahan({acts, nip: dataBawahan[existsIndex].NIP_18, bln})
                  acts = Object.keys(acts).map(e => acts[e])
                  ekin.spinner.succeed(`${Object.keys(acts).length} realisasi kegiatan belum approve dari ${tamsil.nama} poin ${tamsil.poin}`)
                }
  
                while(Array.isArray(acts) && acts.length && poin < maxPoin) {
                  act = acts.shift()
                  if(act.act){
                    ekin.spinner.start(`approve ${Object.keys(act).filter(e=> ['act', 'kode', 'stat', 'bulan'].indexOf(e) === -1).map( e => (`${e}: ${act[e]} |`)).join(' ')}`)
                    act.res = await ekin.approve({act: act.act})
                    poin += act.poin
                    ekin.spinner.succeed(`${act.res.msg}, total poin ${poin}, tgl ${act.tgl} ${dataBawahan[existsIndex].NAMA} ${act.nama}`)
                  }
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