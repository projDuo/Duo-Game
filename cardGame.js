//TODO authorization
// const token = ""
const authorization = document.getElementById("authorization")

document.getElementById("register").addEventListener("click", function(){
    authorization.classList.add("active")
})
document.getElementById("signIn").addEventListener("click", function(){
    authorization.classList.remove("active")
})
document.getElementById("guest").addEventListener("click", function(){
    authorization.classList.add("activeGuest")
})
document.getElementById("signIns").addEventListener("click", function(){
    authorization.classList.remove("activeGuest")
})








// function setCookie(cname, cvalue, exdays) {
//     const d = new Date();
//     d.setTime(d.getTime() + (exdays*24*60*60*1000));
//     let expires = "expires="+ d.toUTCString();
//     document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
//   }

//   function getCookie(cname) {
//     let name = cname + "=";
//     let decodedCookie = decodeURIComponent(document.cookie);
//     let ca = decodedCookie.split(';');
//     for(let i = 0; i <ca.length; i++) {
//       let c = ca[i];
//       while (c.charAt(0) == ' ') {
//         c = c.substring(1);
//       }
//       if (c.indexOf(name) == 0) {
//         return c.substring(name.length, c.length);
//       }
//     }
//     return "";
//   }

//   function checkCookie() {
//     let username = getCookie("username");
//     if (username != "") {
//      alert("Welcome again " + username);
//     } else {
//       username = prompt("Please enter your name:", "");
//       if (username != "" && username != null) {
//         setCookie("username", username, 365);
//       }
//     }
//   }











function activeMenu() {
    document.getElementById("authorization").style.display = "none";
    document.getElementById("menu").style.width = "750px";
    document.getElementById("menuUser").classList.add("active");
}
//! Register
document.getElementById("loginUp").addEventListener("click", function(){
    const login = document.getElementById("loginUp")
    if (login.value === "This login is already taken") {
        login.value = "";
    }
});
document.getElementById("registrationForm").addEventListener('submit', function(event){
    event.preventDefault();
    const login = document.getElementById("loginUp");
    const password = document.getElementById("passwordUp");
    const confirmPassword = document.getElementById("confirmPassword");
    const correctPassword = document.getElementById("correctPassword")

    if(password.value !== confirmPassword.value){
        correctPassword.innerText = "Please, repeat your password correctly"
        return;
    }
    const data = {password: password.value};
    const jsonBody = JSON.stringify(data);

    fetch("https://duo.shuttleapp.rs/api/accounts/"+ login.value,{method: "POST", headers:{"Content-type": "Application/json"}, body: jsonBody})
    .then(response => {
        if(response.status === 201){
            response.text().then(result => {
                console.log(result)
            })
            activeMenu();
        }else if(response.status === 409){
            login.value = "This login is already taken";
            password.value = "";
            confirmPassword.value = "";
        }else if(response.status === 502){
            login.value = "Server dead";
            password.value = "Server dead";
            confirmPassword.value = "Server dead";
        }else{
            console.log("Unknown error")
        }
    })
});
// //! Register
// //? Login
document.getElementById("loginIn").addEventListener("click", function(){
    const login = document.getElementById("loginIn")
    if (login.value === "This account does not exist") {
        login.value = "";
    }
})
document.getElementById("loginForm").addEventListener('submit', function(event){
    event.preventDefault();
    const login = document.getElementById("loginIn");
    const password = document.getElementById("passwordIn");

    fetch("https://duo.shuttleapp.rs/api/accounts/"+ login.value,{method: "GET", headers:{"password": password.value}})
    .then(response => {
        if(response.status === 403){
            document.getElementById("checkPassword").innerText = "Invalid password, please try again"
        }else if(response.status === 404){
            login.value = "This account does not exist"
            password.value = ""
        }else if(response.status === 502){
            login.value = "Server dead";
            password.value = "Server dead";
        }else if(response.status === 200){          
                activeMenu()
        }else{
            console.log("Unknown error")
        }
    });
});
// //? Login
// //! Guest 
document.getElementById("loginGu").addEventListener("click", function(){
    const login = document.getElementById("loginGu")
    if (login.value === "This login is already taken") {
        login.value = "";
    }
});
document.getElementById("guestForm").addEventListener('submit', function(event){
    event.preventDefault();
    const login = document.getElementById("loginGu");

    fetch("https://duo.shuttleapp.rs/api/accounts/"+ login.value,{method: "POST"})
    .then(response => {
        if(response.status === 201){
            activeMenu()
        }else if(response.status === 409){
            login.value = "This login is already taken";
            password.value = "";
            confirmPassword.value = "";
        }else if(response.status === 502){
            login.value = "Server dead";
        }else{
            console.log("Unknown error")
        }
    })
});
//! Guest 
//TODO authorization

// var token = "e80ae7f7-e05b-4ba8-83c3-68c98f310965"

// let room = document.getElementById("room")


// room.addEventListener("click", function(){
//     const roomRo = document.getElementById("roomRo")
//     const passwordRo = document.getElementById("passwordRo")
//     const playerRo = document.getElementById("playerRo")

//     const data = {public: true, password: passwordRo.value, max_players: parseInt(playerRo.value)};
//     const jsonBody = JSON.stringify(data);



//     fetch("https://duo.shuttleapp.rs/api/rooms/",{method:"POST", headers:{"Content-type": "Application/json", "Authorization": token}, body: jsonBody})
//     .then(response => {
//         response.text().then(result =>{
//             console.log(result)
//         })
//     })
// })