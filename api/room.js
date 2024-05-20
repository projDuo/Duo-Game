import { api } from '../cardGame.js';

const bthID =document.getElementById("bthID")

const roomUser =document.getElementById("roomUser")

bthID.addEventListener("click", function(){
    let input = document.createElement("input")
    let password = document.createElement("input")
    password.type = "password"
    input.type = "text"
    roomUser.append(input, password)
})

export class Room{
    constructor(name, is_public, password, max_players){
        this.name = name
        this.is_public = is_public
        this.password = password
        this.max_players = max_players
    }

    create(token){
        const data = {
            name: this.name,
            is_public: this.is_public,
            password: this.password,
            max_players: this.max_players
        };
        const jsonBody = JSON.stringify(data);
        return fetch(api + "/rooms", {method: "POST", headers:{"Content-type": "Application/json", "Authorization": token}, body: jsonBody})
        .then(result => {
            return result
        })
    }

    joinGame(obj_id ,password, token){
        fetch(`https://duo.shuttleapp.rs/api/rooms/${obj_id}/join`, {method: "POST", headers:{"Content-type": "Application/json", "Authorization": token}, body: JSON.stringify(password)})
        .then(result => {
            return result
        })
    }
}