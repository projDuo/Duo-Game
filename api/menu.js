import { Room } from './room.js';
import { globalToken } from '../cardGame.js';

export function activeMenu(nickPlayer){
    document.getElementById("user").innerText = nickPlayer;
    document.getElementById("authorization").style.display = "none";
    document.getElementById("menu").style.width = "750px";
    document.getElementById("menuUser").classList.add("active");

    fetch("https://duo.shuttleapp.rs/api/rooms", {method: "GET"})
    .then(response => response.json())
    .then(data => {
        console.log(data)
        CreateListRoom(data)
        console.log(data)
    })
}

function CreateListRoom(infoRoom) {
    const roomList = document.getElementById("roomList");
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

        joinGameButton.addEventListener('click', () => {
            const room = new Room(obj.name, obj.is_public, obj.password, obj.max_players);
            const passwordRoom = {
                password: passwordInput.value
            };
            room.joinGame(obj.id, passwordRoom, globalToken)
                // .then(result => console.log(result))
        });

        div.append(nameRoomP, playersP, passwordInput, joinGameButton);
        roomList.appendChild(div);
    }
}