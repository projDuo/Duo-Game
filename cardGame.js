const authorization = document.getElementById("authorization")
const register = document.getElementById("register")
const signIn = document.getElementById("signIn")
const guest = document.getElementById("guest")
const signIns = document.getElementById("signIns")

register.addEventListener("click", function(){
    authorization.classList.add("active")
})

signIn.addEventListener("click", function(){
    authorization.classList.remove("active")
})

guest.addEventListener("click", function(){
    authorization.classList.add("activeGuest")
})

signIns.addEventListener("click", function(){
    authorization.classList.remove("activeGuest")
})

// document.getElementById("registrationForm").addEventListener('submit', function() {
//     const login = document.getElementById("loginUp").value;
//     const password = document.getElementById("passwordUp").value;
//     const confirmPassword = document.getElementById("confirmPassword").value
//     const correctPassword = document.getElementById("correctPassword")

//     if(password !== confirmPassword){
//         correctPassword.innerText = "Please, repeat your password correctly"
//         return;
//     }

//     fetch("https://duo.shuttleapp.rs/api/accounts/"+ login,{method: "POST", headers:{"password": password}})
//     .then(response => {
//         if (response.ok) {
//             console.log("Registration successful");
//         } else {
//             console.error("Registration failed");
//         }
//     })
//     .catch(error => {
//         console.error("Error:", error);
//     });
// });


// document.getElementById("loginForm").addEventListener('submit', function() {
//     const login = document.getElementById("loginIn").value;
//     const password = document.getElementById("passwordIn").value;

//     fetch("https://duo.shuttleapp.rs/api/accounts/"+ login,{method: "GET", headers:{"password": password}})
//     .then(response => {
//         console.log(response.text())
//         if (response.ok) {
//             console.log("Registration successful");
//         } else {
//             console.error("Registration failed");
//         }
//     })
//     .catch(error => {
//         console.error("Error:", error);
//     });
// });


// document.getElementById("guestForm").addEventListener('submit', function() {
//     const login = document.getElementById("loginGu").value;

//     fetch("https://duo.shuttleapp.rs/api/accounts/"+ login,{method: "POST"})
//     .then(response => {
//         if (response.ok) {
//             console.log("Registration successful");
//         } else {
//             console.error("Registration failed");
//         }
//     })
//     .catch(error => {
//         console.error("Error:", error);
//     });
// });

const menu = document.getElementById("menu")
const menuUser = document.getElementById("menuUser")

document.getElementById("buttonIn").addEventListener("click", function(){
    authorization.style.display = "none"
    menu.style.width = "750px"
    menuUser.style.display = "flex"
})