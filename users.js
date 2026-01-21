let users = JSON.parse(localStorage.getItem("users")) || [];

// default admin (jaga-jaga)
if(!users.find(u => u.role === "admin")){
  users.push({
    username: "admin",
    password: "admin123",
    role: "admin"
  });
  localStorage.setItem("users", JSON.stringify(users));
}
