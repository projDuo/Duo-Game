export class Profile {  // клас Profile, який описує профіль користувача
    constructor(id, display_name, login, created_at) {
        this.id = id;
        this.display_name = display_name
        this.login = login
        this.created_at = created_at
    }

    static async load(id) {  // Метод для завантаження профілю за id
        let PayLoad = await fetch(`https://duo.shuttleapp.rs/api/users/${id}`) // Завантаження профіля на сервер
            .then(res => res.json()); // Отримання результату сервера
        if (PayLoad) {
            return new Profile(id, PayLoad.display_name, PayLoad.login, PayLoad.created_at)
        }
    }

    static New(id, display_name, login, created_at){ // Конструктор Profile
        return new Profile(id, display_name, login, created_at)
    }
}