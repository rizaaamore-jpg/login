let data = JSON.parse(localStorage.getItem("absen")) || [];

const form = document.getElementById("absenForm");
if(form){
  form.addEventListener("submit", function(e){
    e.preventDefault();

    data.push({
      nama: nama.value,
      kelas: kelas.value,
      status: status.value,
      tanggal: new Date().toISOString().split("T")[0]
    });

    localStorage.setItem("absen", JSON.stringify(data));
    notif.innerText = "Absen berhasil disimpan ✅";
    form.reset();
  });
}

function renderData(){
  const tabel = document.getElementById("tabelAbsen");
  if(!tabel) return;

  tabel.innerHTML = "";

  const fk = document.getElementById("filterKelas").value;
  const ft = document.getElementById("filterTanggal").value;

  data
  .filter(d =>
    (fk === "" || d.kelas === fk) &&
    (ft === "" || d.tanggal === ft)
  )
  .forEach((d,i)=>{
    tabel.innerHTML += `
      <tr>
        <td>${i+1}</td>
        <td>${d.nama}</td>
        <td>${d.kelas}</td>
        <td>${d.status}</td>
        <td>${d.tanggal}</td>
      </tr>`;
  });
}

renderData();
