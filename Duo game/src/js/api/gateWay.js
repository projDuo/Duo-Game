import { api } from './apiPath.js';
import { activeMenu } from '../playerMenu.js';
import { Profile } from './profile.js';
import { Player } from './rooms/player.js';
import * as playerMenu from "../playerMenu.js";
import * as rooms from "./rooms/room.js";
import * as duoGame from "../duoGame.js"; 
import * as auth from "../auth.js"; 
import * as game from "../game.js"; 

export class WebSocketManager {
    constructor(url) {
        this.url = url;
        this.socket = null;
        this.ready = false;
        this.events_buffer = new Array();
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

            this.socket.addEventListener('message', async(event) => { 
                let data = JSON.parse(event.data);

                if (data.Ready) {
                    duoGame.logged_asSet(await  Profile.load(data.Ready.uuid));
                    await activeMenu(data.Ready);
                    for (const element of this.events_buffer) {
                        console.log(element)
                        await process(element);
                    }
                    this.ready = true
                } else if (this.ready === false) {
                    this.events_buffer.push(data)
                    return
                }
                async function process(data) {
                    if (data.RoomCreate) {
                        await roomCreateGateWay(data.RoomCreate);
                    }else if(data.RoomUpdate){
                        playerMenu.roomUpdate(data.RoomUpdate)
                    }else if (data.RoomPlayerNew) {
                        let newUser = await Profile.load(data.RoomPlayerNew.id);
                        playerMenu.newPlayer(newUser)
                    }else if(data.RoomPlayerUpdate){
                        playerMenu.updatePlayerRoom(data.RoomPlayerUpdate)
                    }else if(data.RoomPlayerLeft){
                        playerMenu.leavePlayerRoom(data.RoomPlayerLeft)
                    }else if(data.Error === "InvalidToken"){
                        auth.load()
                    }else if(data.GameStarted){
                        await game.load(data.GameStarted)
                    }else if(data.GameNewTurn){
                        // game.load(data.GameNewTurn)
                    }else if(data.GamePlayerCards){
                        game.spawnPlayersCards(data.GamePlayerCards)
                    }
                } 
                process(data)
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

export async function roomCreateGateWay(data){
    const arr = []
    for(let player of data.players){
        let newPlayer = new Player(player.id, player.is_ready, player.points);
        await newPlayer.load();
        arr.push(newPlayer);
    }
    let room = new rooms.Room(data.id, data.name, data.is_public, data.password, data.max_players, arr, data.owner)
    playerMenu.readyGame(room, data.max_players)
}