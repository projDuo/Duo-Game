import { api } from './apiPath.js';  // Імпортування серверу
import { Profile } from './profile.js'; // Імпортування класу Profile
import { Player } from './rooms/player.js'; // Імпортування класу Player
import * as playerMenu from "../playerMenu.js"; // Імпортування файлу playerMenu.js
import * as rooms from "./rooms/room.js"; // Імпортування файлу rooms.js
import * as duoGame from "../duoGame.js"; // Імпортування файлу duoGame.js
import * as auth from "../auth.js"; // Імпортування файлу auth.js
import * as game from "../game.js"; // Імпортування файлу game.js

export class WebSocketManager {  // Клас для працювання WebSocket
    constructor(url) {
        this.url = url;
        this.socket = null;
        this.ready = false;
        this.events_buffer = new Array();
    }
 
    async openWebSocket() {  // Метод для відкриття з'єднання з сервером
        return new Promise((resolve, reject) => {
            const socket = new WebSocket(this.url); // Створення нового екземпляру WebSocket

            socket.onopen = () => {  // Поверення успішного відповіді
                resolve(socket);
            };

            socket.onerror = (error) => {  // Повернення помилки
                reject(error);
            };
        });
    }

    async connect() {  // Метод для приєднання до серверу, та обробка повідомлень з серверу 
        try {
            this.socket = await this.openWebSocket();

            this.socket.addEventListener('message', async(event) => {  // Отримання відповіді з серверу
                let data = JSON.parse(event.data); // Парсинг тексту JSON

                if (data.Ready) {  // Отримання інформації про акаунт гравця
                    duoGame.logged_asSet(await  Profile.load(data.Ready.uuid));  // Збереження локально акаунт гравця
                    await playerMenu.activeMenu(data.Ready);  // активація меню
                    for (const element of this.events_buffer) {  // Обробка повідомлень з буфера
                        await process(element);
                    }
                    this.ready = true
                }else if (this.ready === false) {  // Якщо не отримав акаунт гравця, то перенаправити повідомлення в буфер
                    this.events_buffer.push(data)
                    return
                }
                async function process(data) {  // Обробка повідомлення
                    if (data.RoomCreate) {  // Обробка створення кімнати
                        await roomCreateGateWay(data.RoomCreate);
                    }else if(data.RoomUpdate){  // Обробка оновлення кімнати
                        playerMenu.roomUpdate(data.RoomUpdate)
                    }else if (data.RoomPlayerNew) {  // Обробка нового гравця
                        let newUser = await Profile.load(data.RoomPlayerNew.id);
                        playerMenu.newPlayer(newUser)
                    }else if(data.RoomPlayerUpdate){  // Обробка оновлення гравця
                        playerMenu.updatePlayerRoom(data.RoomPlayerUpdate)
                    }else if(data.RoomPlayerLeft){  // Обробка виходу гравця
                        playerMenu.leavePlayerRoom(data.RoomPlayerLeft)
                    }else if(data.Error === "InvalidToken"){  // Обробка помилки
                        auth.load()
                    }else if(data.GameStarted){  // Обробка створення нової гри
                        await game.load(data.GameStarted)
                    }else if(data.GameNewTurn){  // Обробка нового ходу
                        game.update(data.GameNewTurn)
                    }else if(data.GamePlayerCards){  // Обробка карток гравця
                        game.spawnPlayersCards(data.GamePlayerCards)
                    }else if(data.GameOver){  // Обробка кінця гри
                        game.GameOver(data.GameOver)
                    }
                } 
                process(data)
            });
        } catch (error) {  // Обробка помилки, коли WebSocket не вийшло відкрити
            console.error('WebSocket connection failed:', error);
            throw error;
        }
    }

    async sendData(data) {  // Метод надсилання повідомлення на сервер
        if (!this.socket) {
            throw new Error('WebSocket is not connected');
        }

        try {
            this.socket.send(JSON.stringify(data));
        } catch (error) {
            console.error('Failed to send data via WebSocket:', error);
            throw error;
        }
    }

    async identify(token){  // Метод надсилання повідомлення індетифікації
        const dataEnd = {
            Identify: {
                token: token
            }
        };
        try {
            await this.sendData(dataEnd);
        }catch{}}
}

export async function roomCreateGateWay(data){  // Перетворення JSON в клас кімнат, та відображення меню
    const arr = []
    for(let player of data.players){
        let newPlayer = new Player(player.id, player.is_ready, player.points);
        await newPlayer.load();
        arr.push(newPlayer);
    }
    let room = new rooms.Room(data.id, data.name, data.is_public, data.password, data.max_players, arr, data.owner)
    playerMenu.readyGame(room, data.max_players)
}