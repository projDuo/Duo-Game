import { Auth } from './api/auth.js';
import { Room } from './api/room.js';
import { WebSocketManager } from './api/gateWay.js';
import { activeMenu } from './api/menu.js';
import { CreateListRoom } from './api/menu.js';

export const api = "https://duo.shuttleapp.rs/api"

//TODO authorization
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

export let globalToken = ""


const url = 'wss://duo.shuttleapp.rs/api/gateway';

async function gate(response) {
    const gateway = new WebSocketManager(url)
    await gateway.connect();
    const token = await response.text();
    await gateway.identify(token);
    globalToken = token
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
    const accountReg = new Auth(login, password)

    if(password.value !== confirmPassword.value){
        correctPassword.innerText = "Please, repeat your password correctly"
        return;
    }

    accountReg.register().then(response => {
        if(response.status === 200){
            gate(response)
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
//! Register
//? Login
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
    const accountLog = new Auth(login, password)

    accountLog.auth().then(response => {
        if(response.status === 403){
            document.getElementById("checkPassword").innerText = "Invalid password, please try again"
        }else if(response.status === 404){
            login.value = "This account does not exist"
            password.value = ""
        }else if(response.status === 502){
            login.value = "Server dead";
            password.value = "Server dead";
        }else if(response.status === 200){  
            gate(response)
        }
    })
});
//? Login
//! Guest 
// document.getElementById("loginGu").addEventListener("click", function(){
//     const login = document.getElementById("loginGu")
//     if (login.value === "This login is already taken") {
//         login.value = "";
//     }
// });

// document.getElementById("guestForm").addEventListener('submit', function(event){
//     event.preventDefault();
//     const login = document.getElementById("loginGu");
//     (async () => {
//         await gateway.connect();
//         const token = await response.body;
//         await gateway.identify(token);
//         console.log("AAA");
//     })();

// });
//! Guest 
//TODO authorization
let isIcon = false;

document.getElementById("roomCheck").addEventListener("click", function(){
    isIcon = !isIcon;
    console.log(isIcon)
});

export function activePlayersBlock(maxPlayersRoom){
    const userThree = document.getElementById("userThree")
    const userFour = document.getElementById("userFour")

    if(maxPlayersRoom === 3){
        userThree.classList.add("active")
    }else if(maxPlayersRoom === 4){
        userThree.classList.add("active")
        userFour.classList.add("active")
    }
}

document.getElementById("createRoom").addEventListener("click", function(){
    const nameRoom = document.getElementById("nameRoom").value
    const passwordRoom = document.getElementById("passwordRoom").value
    const maxPlayersRoom = document.getElementById("maxPlayersRoom").value 

    activePlayersBlock(parseInt(maxPlayersRoom))

    new Room(nameRoom, isIcon, passwordRoom, parseInt(maxPlayersRoom)).create(globalToken)
})

export function readyGame(roomInfo){
    const menuInformation = document.getElementById("menuInformation")
    const readyMenu = document.getElementById("readyMenu")
    const nameUser = document.getElementById("nameUser")
    const roomName = document.getElementById("roomName")
    const idRoom = document.getElementById("idRoom")

    menuInformation.classList.add("active")
    readyMenu.classList.add("active")
    roomName.innerText = roomInfo.name
    idRoom.innerText = `id: ${roomInfo.id}`
    nameUser.innerText = roomInfo.players[0].display_name;
}

document.getElementById("buttonReady").addEventListener("click", function(){
    const buttonReady = document.getElementById("buttonReady")
    const statusReady = document.getElementById("statusReady")
    
    if(statusReady.innerText === "Not Ready"){
        statusReady.innerText = "Ready"
        buttonReady.value = "Not Ready"
    }else{
        statusReady.innerText = "Not Ready"
        buttonReady.value = "Read"
    }
})







const reloadRoom = document.getElementById("reloadRoom")

reloadRoom.addEventListener("click", function(){
        fetch("https://duo.shuttleapp.rs/api/rooms", {method: "GET"})
        .then(response => response.json())
        .then(data => {
            CreateListRoom(data)
    })
})

const bthID = document.getElementById("bthID")
const roomList = document.getElementById("roomList")
const joinById = document.getElementById("joinById")

bthID.addEventListener("click", function(){
    roomList.classList.add("active")
    joinById.classList.add("active")
})

const exitIdBth = document.getElementById("exitIdBth")

exitIdBth.addEventListener("click", function(){
    roomList.classList.remove("active")
    joinById.classList.remove("active")
})

const bthJoinId = document.getElementById("bthJoinId")

bthJoinId.addEventListener("click", function(){
    const inputIdRoom = document.getElementById("inputIdRoom")
    const passwordIdRoom = document.getElementById("passwordIdRoom")

    const room = new Room();

    room.joinGame(inputIdRoom.value, passwordIdRoom.value, globalToken)
})


// function CreateListRoom(infoRoom) {
//     const roomList = document.getElementById("roomList");
//     for (let obj of infoRoom) {
//         const div = document.createElement("div");
//         const nameRoomP = document.createElement("p");
//         const playersP = document.createElement("p");
//         const passwordInput = document.createElement("input");
//         const joinGameButton = document.createElement("input");

//         div.classList.add("room");
//         nameRoomP.classList.add("nameRoomP");
//         playersP.classList.add("nameRoomP");
//         passwordInput.classList.add("passwordInput");
//         joinGameButton.classList.add("joinGameButton");

//         passwordInput.type = "password";
//         joinGameButton.type = "button";

//         nameRoomP.innerText = obj.name;
//         playersP.innerText = `Players: ${obj.players}/${obj.max_players}`;
//         passwordInput.placeholder = "Password";
//         joinGameButton.value = "Join game";

//         joinGameButton.addEventListener('click', () => {
//             const room = new Room(obj.name, obj.is_public, obj.password, obj.max_players);
//             const passwordRoom = {
//                 password: passwordInput.value
//             };
//             room.joinGame(obj.id, passwordRoom, globalToken)
//                 .then(result => console.log(result))
//         });

//         div.append(nameRoomP, playersP, passwordInput, joinGameButton);
//         roomList.appendChild(div);
//     }
// }

document.addEventListener("DOMContentLoaded", () => {
    const sections = {
        playerStatistics: document.getElementById("playerStatistics"),
        rooms: document.getElementById("rooms"),
        friends: document.getElementById("friends"),
        rating: document.getElementById("rating"),
        setting: document.getElementById("setting")
    };

    const buttons = {
        bthRoom: sections.rooms,
        bthFriends: sections.friends,
        bthRating: sections.rating,
        bthSetting: sections.setting
    };

    // Функція для приховання всіх секцій, окрім обраної
    function hideAllSections() {
        Object.values(sections).forEach(section => {
            section.classList.add("hidden");
        });
    }

    // Додаємо обробник кліку для користувацької кнопки
    document.getElementById("user").addEventListener("click", () => {
        hideAllSections(); // Приховуємо всі секції
        sections.playerStatistics.classList.remove("hidden"); // Показуємо обрану секцію
    });

    // Додаємо обробник кліку для інших кнопок
    Object.entries(buttons).forEach(([buttonId, section]) => {
        document.getElementById(buttonId).addEventListener("click", () => {
            hideAllSections(); // Приховуємо всі секції
            section.classList.remove("hidden"); // Показуємо обрану секцію
        });
    });

    // Початково приховуємо всі секції крім першої
    hideAllSections();
    sections.rooms.classList.remove("hidden");
});
