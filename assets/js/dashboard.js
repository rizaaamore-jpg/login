function logout(){
  localStorage.removeItem('login');
  window.location.href = 'login.html';
}

function toggleDark(){
  document.body.classList.toggle('dark');
}
