function exportExcel(){
  let data = JSON.parse(localStorage.getItem("absen")) || [];
  if(data.length === 0){
    alert("Data kosong");
    return;
  }

  let csv = "No,Nama,Kelas,Status,Tanggal\n";
  data.forEach((d,i)=>{
    csv += `${i+1},${d.nama},${d.kelas},${d.status},${d.tanggal}\n`;
  });

  let blob = new Blob([csv], {type:"text/csv"});
  let a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "absensi.csv";
  a.click();
}
