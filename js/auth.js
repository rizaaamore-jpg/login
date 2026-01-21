document.getElementById('loginForm').addEventListener('submit', function(e){
  e.preventDefault();

  const user = document.getElementById('user').value;
  const pass = document.getElementById('pass').value;

  if(user === 'admin' && pass === 'admin123'){
    localStorage.setItem('login','true');
    window.location.href = 'dashboard.html';
  } else {
    alert('Username atau Password salah');
  }
});
