export class Profile {
    constructor(id, display_name, login, created_at) {
        this.id = id;
        this.display_name = display_name
        this.login = login
        this.created_at = created_at
    }

    static async load(id) {
        let PayLoad = await fetch(`https://duo.shuttleapp.rs/api/users/${id}`)
            .then(res => res.json());
            
        if (PayLoad) {
            return new Profile(id, PayLoad.display_name, PayLoad.login, PayLoad.created_at)
        }
    }

    static New(id, display_name, login, created_at){
        return new Profile(id, display_name, login, created_at)
    }
}