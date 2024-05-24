import { api } from '../cardGame.js';
import { readyGame } from '../cardGame.js';
import { activeMenu } from './menu.js';
import { Player } from './player.js';
import { activePlayersBlock } from '../cardGame.js';

export class WebSocketManager {
    constructor(url) {
        this.url = url;
        this.socket = null;
    }

    async openWebSocket() {
        return new Promise((resolve, reject) => {
            const socket = new WebSocket(this.url);

            socket.onopen = () => {
                resolve(socket);
            };

            socket.onerror = (error) => {
                reject(error);
            };
        });
    }

    async connect() {
        try {
            this.socket = await this.openWebSocket();

            this.socket.addEventListener('message', (event) => { 
                let data = JSON.parse(event.data);
                
                console.log(data)
                console.log(data.RoomPlayerNew)

                if (data.Ready) {
                    activeMenu(data.Ready.login);
                }else if(data.RoomCreate) {
                    readyGame(data.RoomCreate)
                    activePlayersBlock(data.RoomCreate.max_players)
                } else if (data.RoomPlayerNew) {
                    let newPlayer = new Player(data.RoomPlayerNew.player.id);
                    newPlayer.load()
                        .then(() => {
                            // Встановлення імені гравця у другій карточці
                            document.getElementById('nameUser2').textContent = newPlayer.display_name;
                            console.log(newPlayer.display_name); // Для перевірки в консолі
                            console.log(newPlayer.login);
                        })
                }
            });
         
            this.socket.addEventListener('close', () => { 
                console.log('Disconnected from WebSocket server'); 
            });
        } catch (error) {
            console.error('WebSocket connection failed:', error);
            throw error;
        }
    }

    async sendData(data) {
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

    async identify(token){
        const dataEnd = {
            Identify: {
                token: token
            }
        };
        try {
            await this.sendData(dataEnd);
        }catch{}}
}