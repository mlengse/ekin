exports._approveSKPStaff = async ({ that, i }) => {
  for(let dataBawahan of that.users[i].dataBawahan){
    let dataBawahans = await that.fetchSKPStaff({dataBawahan})
    if(dataBawahans.length) for( let datBaw of dataBawahans) {
      let perilakuExist = await that.checkPerilaku({dataBawahan: datBaw})
      if (Object.keys(perilakuExist).length < 6) {
        let dataKegSKPStaff = await that.fetchSKPTahunanStaff({dataBawahan: datBaw})
        if(dataKegSKPStaff.length) for(let kegSKP of dataKegSKPStaff){
          kegSKP = await that.fetchKegSKP({kegSKP})
          if( !kegSKP.TARGET_KUALITAS_R ) {
            kegSKP.TARGET_KUALITAS_R = that.getKualitasRand()
            await that.inputKualitas({ kegSKP })                
          }
        }
        await that.inputPerilaku({ dataBawahan: datBaw })
      }
    }
  }
}