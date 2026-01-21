document.querySelector("form").addEventListener("submit", function(e){
  e.preventDefault();

  const userInput = document.querySelector("input[type=text]").value;
  const passInput = document.querySelector(".pass-key").value;

  let users = JSON.parse(localStorage.getItem("users")) || [];

  let user = users.find(u =>
    u.username === userInput && u.password === passInput
  );

  if(user){
    localStorage.setItem("role", user.role);
    localStorage.setItem("loginUser", user.username);

    if(user.role === "admin"){
      window.location.href = "admin.html";
    } else {
      window.location.href = "siswa.html";
    }
  } else {
    alert("Login gagal ❌");
  }
});
