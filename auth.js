document.querySelector("form").addEventListener("submit", function(e){
  e.preventDefault();

  const user = document.querySelector("input[type=text]").value;
  const pass = document.querySelector(".pass-key").value;

  if(user === "admin" && pass === "admin123"){
    localStorage.setItem("role","admin");
    window.location.href = "admin.html";
  }
  else if(user === "siswa" && pass === "siswa123"){
    localStorage.setItem("role","siswa");
    window.location.href = "siswa.html";
  }
  else{
    alert("Username atau password salah");
  }
});
