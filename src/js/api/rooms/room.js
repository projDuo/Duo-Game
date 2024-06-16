import { api } from '../apiPath.js';   // Імпортування серверу

export class Room{    // клас Room(), відображення кімнати
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
        fetch(`https://duo.shuttleapp.rs/api/rooms/${this.id}/leave`, {method: "POST", headers:{"Content-type": "Application/json", "Authorization": token}})  // Метод для виходу гравця з кімнати
    }

    ready(token){
        return fetch(`https://duo.shuttleapp.rs/api/rooms/${this.id}/ready`, {method: "POST", headers:{"Content-type": "Application/json", "Authorization": token}})  // Метод для стану гравця 
        .then(result => {
            return result.status
        })
    }
}

export async function joinGame(obj_id ,password, token){  // Функція приєднання до кімнати
    const PayLoad = {
        password: password
    };
    return await fetch(`https://duo.shuttleapp.rs/api/rooms/${obj_id}/join`, {method: "POST", headers:{"Content-type": "Application/json", "Authorization": token}, body: JSON.stringify(PayLoad)}) // Отримання кімнати з серверу
}

export function create(token, name, is_public, password, max_players){  // Функція створення кімнати
    const data = {
        name: name,
        is_public: is_public,
        password: password,
        max_players: max_players
    };
    const jsonBody = JSON.stringify(data);
    return fetch(api + "/rooms", {method: "POST", headers:{"Content-type": "Application/json", "Authorization": token}, body: jsonBody})  // Створення кімнати на сервері
    .then(result => {
        return result
    })
}