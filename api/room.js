import { api } from '../cardGame.js';


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

        const PayLoad = {
            password: password
        };
        
        fetch(`https://duo.shuttleapp.rs/api/rooms/${obj_id}/join`, {method: "POST", headers:{"Content-type": "Application/json", "Authorization": token}, body: JSON.stringify(PayLoad)})
        .then(result => {
            // console.log(result)
            return result
        })
    }
}