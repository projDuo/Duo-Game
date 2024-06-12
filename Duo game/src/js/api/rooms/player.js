import {Profile} from '../profile.js'                     // Імпортування класу Profile

export class Player extends Profile{                      // Успадкування класу Profile
    constructor(id, is_ready, points){                    
        super(id, null, null, null)                       // Виклик конструктора Profile
        this.is_ready = is_ready
        this.points = points
    }

    async load() {                                        // Асинхрона метод котра загружає профіль сервера по id гравця
        let profile = await Profile.load(this.id);        // Використання функції load(), для завантаження гравця
        if (profile) {
            this.display_name = profile.display_name;
            this.login = profile.login;
            this.created_at = profile.created_at;
        }
    }

    static async create(id, is_ready, points) {            // метод щоб загружати шнформацію про гравця у кімнату
        const player = new Player(id, is_ready, points);   // Виклик нового екземпляра класу new Player()
        await player.load();
        return player;
    }
}