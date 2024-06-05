import * as rooms from "./api/rooms/room.js"; 
import { globalToken } from './auth.js';
import { roomCreateGateWay } from './api/gateWay.js'
import { logged_as } from "./duoGame.js";

export async function load(){
    const response = await fetch("playerMenu.html")
    const text = await response.text();
    document.getElementById('menu').innerHTML = text;

    const createRoom = document.getElementById("createRoom");
    createRoom.addEventListener("click", function(){
        const nameRoom = document.getElementById("nameRoom").value;
        const passwordRoom = document.getElementById("passwordRoom").value;
        const maxPlayersRoom = document.getElementById("maxPlayersRoom").value; 

        rooms.create(globalToken, nameRoom, isIcon, passwordRoom, parseInt(maxPlayersRoom));
    });

    let isIcon = false;
    
    document.getElementById("roomCheck").addEventListener("click", function(){
        isIcon = !isIcon;
        console.log(isIcon);
    });


    document.getElementById("reloadRoom").addEventListener("click", function(){
        fetch("https://duo.shuttleapp.rs/api/rooms", {method: "GET"})
            .then(response => response.json())
            .then(data => {
                CreateListRoom(data);
        });
    })
    //! Вхід по ід
    const roomList = document.getElementById("roomList");
    const joinById = document.getElementById("joinById");

    document.getElementById("bthID").addEventListener("click", function(){
        roomList.classList.add("active");
        joinById.classList.add("active");
    });

    document.getElementById("exitIdBth").addEventListener("click", function(){
        roomList.classList.remove("active");
        joinById.classList.remove("active");
    });

    document.getElementById("bthJoinId").addEventListener("click", async function(){
        const inputIdRoom = document.getElementById("inputIdRoom");
        const passwordIdRoom = document.getElementById("passwordIdRoom");
        let data = await rooms.joinGame(inputIdRoom.value, passwordIdRoom.value, globalToken)
        roomCreateGateWay(JSON.parse(await data.text()))
    });

//? Вкладки

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

        function hideAllSections() {
            Object.values(sections).forEach(section => {
                section.classList.add("hidden");
            });
        }

        const userButton = document.getElementById("user");
        if (userButton) {
            userButton.addEventListener("click", () => {
                hideAllSections();
                sections.playerStatistics.classList.remove("hidden");
            });
        }

        Object.entries(buttons).forEach(([buttonId, section]) => {
            const button = document.getElementById(buttonId);
            if (button) {
                button.addEventListener("click", () => {
                    hideAllSections();
                    section.classList.remove("hidden");
                });
            }
        });

        hideAllSections();
        sections.rooms.classList.remove("hidden");
}













let readyPlayers = 0

export function readyGame(roomInfo, maxPlayer) {
    const menuInformation = document.getElementById("menuInformation");
    const readyMenu = document.getElementById("readyMenu");
    const roomName = document.getElementById("roomName");
    const idRoom = document.getElementById("idRoom");
    const users = document.getElementById("users");
    const startGame = document.getElementById("startGame");
    const leaveRoomButton = document.getElementById("leaveRoom");
    const buttonReady = document.getElementById("buttonReady");

    users.innerHTML = "";
    
    menuInformation.classList.add("active");
    readyMenu.classList.add("active");
    startGame.disabled = true;
    
    roomName.innerText = roomInfo.name;
    idRoom.innerText = `id: ${roomInfo.id}`;

    function leaveRoomHandler() {
        roomInfo.leave(globalToken);
        menuInformation.classList.remove("active");
        readyMenu.classList.remove("active");
        updateList();
        leaveRoomButton.removeEventListener("click", leaveRoomHandler);
        buttonReady.removeEventListener("click", buttonReadyHandler);
    }

    function buttonReadyHandler() {
        roomInfo.ready(globalToken);
    }

    startGame.addEventListener("click", function(){
        fetch(`https://duo.shuttleapp.rs/api/rooms/${roomInfo.id}/game`, {method: "POST", headers:{"Content-type": "Application/json", "Authorization": globalToken}})
        .then(async result => {
            if(result.status === 200){
                document.getElementById("menu").style.display = "none";
                async function loadGame() {
                  const response = await fetch("game.html");
                  const text = await response.text();
                  document.body.innerHTML = text;
                }
                loadGame();
                console.log("YAP")
            }else{
                console.log("Error")
            }
        })
    })

    leaveRoomButton.addEventListener("click", leaveRoomHandler);
    buttonReady.addEventListener("click", buttonReadyHandler);

    if (roomInfo.owner === logged_as.id) {
        startGame.disabled = false;
    }

    for (let player of roomInfo.players) {
        newPlayer(player);
    }
}

export function newPlayer(playerInfo){
    const users = document.getElementById("users")
    const blockUser = document.createElement("div")
    const nameUser = document.createElement("h2")
    const line = document.createElement("div")
    const statusReady = document.createElement("p")
    blockUser.id = `RoomPlayer${playerInfo.id}`

    blockUser.classList.add("blockUser")
    nameUser.classList.add("nameUser")
    line.classList.add("line")
    statusReady.classList.add("statusReady")

    statusReady.innerText = playerInfo.is_ready ? "Ready" : "Not Ready"
    readyPlayers += playerInfo.is_ready ? 1 : 0
    nameUser.innerText = playerInfo.display_name

    blockUser.append(nameUser, line, statusReady)
    users.append(blockUser)
}

export function updatePlayerRoom(playerInfo){
    const blockUser = document.getElementById(`RoomPlayer${playerInfo.id}`)
    if(blockUser === undefined){
        newPlayer(playerInfo)
    }else{
        try{
            const statusReady = blockUser.getElementsByTagName("p")[0]
            statusReady.innerText = playerInfo.is_ready ? "Ready" : "Not Ready"
            readyPlayers += playerInfo.is_ready ? 1 : -1
        }catch(err){}
    }
}

export function leavePlayerRoom(playerInfo){
    const blockUser = document.getElementById(`RoomPlayer${playerInfo}`)
    if(blockUser !== undefined){
        blockUser.remove()
    }
}

export function roomUpdate(roomInfo){
    document.getElementById("roomName").value = roomInfo.name
    const startGame = document.getElementById("startGame")
    if(roomInfo.owner === logged_as.id){
        startGame.disabled = false
    }else{
        startGame.disabled = true
    }
}





export async function activeMenu(){
    await load()
    document.getElementById("user").innerText = logged_as.display_name;
    document.getElementById("menu").style.width = "750px";
    document.getElementById("menuUser").classList.add("active");
    document.getElementById("userStatistics").innerText = logged_as.display_name

    // 
    fetch(`https://duo.shuttleapp.rs/api/users/${logged_as.id}/stat`, {method: "GET"})
    .then(async result => {
        let a = await result.text()
        console.log(JSON.parse(a))
    })
    // 
    
    updateList()
    setInterval(updateList, 20000)
}

function updateList(){
    fetch("https://duo.shuttleapp.rs/api/rooms", {method: "GET"})
    .then(response => response.json())
    .then(data => {
        CreateListRoom(data);
    });
}

function CreateListRoom(infoRoom) {
    const roomList = document.getElementById("roomList");
    roomList.innerHTML = ""
    for (let obj of infoRoom) {
        const div = document.createElement("div");
        const nameRoomP = document.createElement("p");
        const playersP = document.createElement("p");
        const passwordInput = document.createElement("input");
        const joinGameButton = document.createElement("input");

        div.classList.add("room");
        nameRoomP.classList.add("nameRoomP");
        playersP.classList.add("nameRoomP");
        passwordInput.classList.add("passwordInput");
        joinGameButton.classList.add("joinGameButton");

        passwordInput.type = "password";
        joinGameButton.type = "button";

        nameRoomP.innerText = obj.name;
        playersP.innerText = `Players: ${obj.players}/${obj.max_players}`;
        passwordInput.placeholder = "Password";
        joinGameButton.value = "Join game";

        if(obj.players >= obj.max_players) {
            joinGameButton.disabled = true;
            passwordInput.disabled = true;
            joinGameButton.value = "Room full"
            joinGameButton.classList.remove("joinGameButton");
            joinGameButton.classList.add("joinGameButtonFull");
        }

        joinGameButton.addEventListener('click', async () => {
            let data = await rooms.joinGame(obj.id, passwordInput.value, globalToken)
            roomCreateGateWay(JSON.parse(await data.text()))
        });

        div.append(nameRoomP, playersP, passwordInput, joinGameButton);
        roomList.appendChild(div);
    }
}