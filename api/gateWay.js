import { api } from '../cardGame.js';
import { readyGame } from '../cardGame.js';
import { activeMenu } from './menu.js';
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
                if (data.Ready) {
                    activeMenu(data.Ready.login);
                }else if(data.RoomCreate) {
                    readyGame(data.RoomCreate)
                    activePlayersBlock(data.RoomCreate.max_players)
                    console.log(data)
                    console.log(data.RoomCreate.max_players)
                }else{

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

    // activeMenu(nickPlayer) {
    //     document.getElementById("user").innerText = nickPlayer;
    //     document.getElementById("authorization").style.display = "none";
    //     document.getElementById("menu").style.width = "750px";
    //     document.getElementById("menuUser").classList.add("active");

    //     fetch(api + "/rooms?limit=100", {method:"GET"})
    //     .then(result => console.log(result.json()))

    //     fetch("https://duo.shuttleapp.rs/api/rooms", {method: "GET"})
    //     .then(response => response.json())
    //     .then(data => {
    //         console.log(data)
    //         CreateListRoom(data)
    //         console.log(data)
    //     })
    // }
}