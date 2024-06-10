import {Profile} from '../profile.js'

export class Player extends Profile{
    constructor(id, is_ready, points){
        super(id, null, null, null)
        this.is_ready = is_ready
        this.points = points
    }

    async load() {
        let profile = await Profile.load(this.id);
        if (profile) {
            this.display_name = profile.display_name;
            this.login = profile.login;
            this.created_at = profile.created_at;
        }
    }

    static async create(id, is_ready, points) {
        const player = new Player(id, is_ready, points);
        await player.load();
        return player;
    }
}