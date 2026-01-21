function logout(){
  localStorage.removeItem('login');
  window.location.href = 'login.html';
}
