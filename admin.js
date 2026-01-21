function toggleDark(){
  document.body.classList.toggle("dark");
}

localStorage.setItem("settingAbsen", JSON.stringify({...}))

// default jam absensi
if(!localStorage.getItem("absenTime")){
  localStorage.setItem("absenTime", JSON.stringify({
    open: 7,
    close: 15
  }));
}
