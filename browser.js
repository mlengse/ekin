const hapusRealisasiKegiatan = () => {
  window.confirm = function (_, __) {
    return true
  }
  hapus()
}

const saveRealisasiKegiatan = () => {
  window.alert = (_) => true
  KD_KEGIATAN_BULAN1 = $('#KD_KEGIATAN_BULAN').val();
  NM_KEGIATAN_BULAN1 = $('#NM_KEGIATAN_BULAN').val();
  KD_REALISASI_KEGIATAN1 = $('#KD_REALISASI_KEGIATAN').val();
  NM_KEGIATAN1 = $('#NM_KEGIATAN').val();
  KD_AKTIVITAS1 = $('#KD_AKTIVITAS').val();
  KUANTITAS1 = $('#KUANTITAS').val();
  TGL_REALISASI1 = $('#TGL_REALISASI').val();
  JAM_MULAI1 = $('#JAM_MULAI').val();
  JAM_SELESAI1 = $('#JAM_SELESAI').val();
  BIAYA1 = $('#BIAYA').val();
  KETERANGAN1 = $('#KETERANGAN').val();
  return new Promise(resolve=>{
    if (KD_REALISASI_KEGIATAN1) {
      show_loading();
      $.ajax({
        type: "POST",
        url: "http://203.190.116.234/e-kinerja/v1/d_realisasi_kegiatan/simpan",
        data: {
          KD_KEGIATAN_BULAN: KD_KEGIATAN_BULAN1,
          NM_KEGIATAN_BULAN: NM_KEGIATAN_BULAN1,
          KD_REALISASI_KEGIATAN: KD_REALISASI_KEGIATAN1,
          NM_KEGIATAN: NM_KEGIATAN1,
          KD_AKTIVITAS: KD_AKTIVITAS1,
          KUANTITAS: KUANTITAS1,
          TGL_REALISASI: TGL_REALISASI1,
          JAM_MULAI: JAM_MULAI1,
          JAM_SELESAI: JAM_SELESAI1,
          BIAYA: BIAYA1,
          KETERANGAN: KETERANGAN1
        },
        success: function (data) {
          data = JSON.parse(data);
          resolve(data)
          if (data.status) {
            hide_loading();
            tampil_data();
            // tabel_d_realisasi_kegiatan();
            // alert('Berhasil menyimpan data');
            batal();
          }
          else {
            hide_loading();
            alert('Gagal menyimpan data : ' + data.error);
          }
        }
      });
    }
    else {
      resolve("Realisasi kegiatan kosong");
    }

  })
}

const buatKodeRealisasiKeg = (act) => {
  eval(act)
  window.confirm = function (_, __) {
    return true
  }
  buat_kode_d_realisasi_kegiatan()
}

const delInputBulanan = () => {
  let KD_KEGIATAN_BULAN1 = $("#KD_KEGIATAN_BULAN").val();
  window.alert = (_) => true
  return new Promise ( resolve => {
    $.ajax({
      type    : "POST",
      url     : "http://203.190.116.234/e-kinerja/v1/d_kegiatan_bulan/hapus",
      data    : {KD_KEGIATAN_BULAN:KD_KEGIATAN_BULAN1},
      success : function(data){
        if(data){
          data = JSON.parse(data);
          resolve(data)
          if(data.status){
            hide_loading();
            batal();
            tabel_d_kegiatan_bulan();
            alert("Data berhasil dihapus");
          }
          else{
            hide_loading();
            alert('Data gagal dihapus : '+data.error);
          }
        }
      }
    })
  })
}

const saveInputBulanan = () => {
  window.alert = (_) => true
  return new Promise(resolve => {
    $.ajax({
      type: 'POST',
      url: "http://203.190.116.234/e-kinerja/v1/d_kegiatan_bulan/simpan",
      data: $("#form_d_kegiatan_bulan").serialize(),
      success: function (data) {
        data = JSON.parse(data);
        if (data.status) {
          resolve(data)
          hide_loading();
          tabel_d_kegiatan_bulan();
          alert('Berhasil menyimpan data');
          alert('data berhasil disimpan');
          batal();
        }
        else {
          resolve(data)
          hide_loading();
          alert('Gagal menyimpan data : ' + data.error);
        }

      },
      error: function (xhr, textStatus, errorThrown) {
        resolve(textStatus)
        hide_loading();
        alert('Gagal menyimpan data:' + data.error);
      }
    });
  })
}

const buatKodeInputBln = act => {
  window.confirm = function(_, __) {
    return true;
  };
  let actArr = act.split(`','`)
  let kode = actArr[0].split(`'`)[1]
  let desc = actArr[1].split(`'`)[0];
  klik_data_d_kegiatan_tahun(kode, desc)
  //eval(act)
}

const tableKegEval = (tableId) => {
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
    keg.stat = keg.text[4]
    if(keg.act && keg.act.includes('kegiatan_tahun')){
      keg.jml = keg.text[4]
    }
    kegList.push(keg)
  }
  return kegList
}

const tabelBawahan = () => {
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
    keg.stat = keg.text[4]
    if(keg.act && keg.act.includes('kegiatan_tahun')){
      keg.jml = keg.text[4]
    }
    kegList.push(keg)
  }
  return kegList

}

module.exports = {
  tabelBawahan,
  tableKegEval,
  saveRealisasiKegiatan,
  hapusRealisasiKegiatan,
  buatKodeRealisasiKeg,
  saveInputBulanan,
  delInputBulanan,
  buatKodeInputBln
}