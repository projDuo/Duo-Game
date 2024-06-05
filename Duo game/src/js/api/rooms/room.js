import { api } from '../apiPath.js';

export class Room{
    constructor(id, name, is_public, password, max_players, players, owner){
        this.id = id
        this.name = name
        this.is_public = is_public
        this.password = password
        this.max_players = max_players
        this.players = players
        this.owner = owner
    }

    leave(token){
        fetch(`https://duo.shuttleapp.rs/api/rooms/${this.id}/leave`, {method: "POST", headers:{"Content-type": "Application/json", "Authorization": token}})
    }

    ready(token){
        return fetch(`https://duo.shuttleapp.rs/api/rooms/${this.id}/ready`, {method: "POST", headers:{"Content-type": "Application/json", "Authorization": token}})
        .then(result => {
            return result.status
        })
    }
}

export async function joinGame(obj_id ,password, token){
    const PayLoad = {
        password: password
    };
    return await fetch(`https://duo.shuttleapp.rs/api/rooms/${obj_id}/join`, {method: "POST", headers:{"Content-type": "Application/json", "Authorization": token}, body: JSON.stringify(PayLoad)})
}

export function create(token, name, is_public, password, max_players){
    const data = {
        name: name,
        is_public: is_public,
        password: password,
        max_players: max_players
    };
    const jsonBody = JSON.stringify(data);
    return fetch(api + "/rooms", {method: "POST", headers:{"Content-type": "Application/json", "Authorization": token}, body: jsonBody})
    .then(result => {
        return result
    })
}