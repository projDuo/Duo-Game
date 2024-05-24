export class Player {
    constructor(id) {
        this.id = id;
        this.display_name = null
        this.login = null
    }

    async load() {
        let PayLoad = await fetch(`https://duo.shuttleapp.rs/api/users/${this.id}`)
            .then(res => res.json());
    
        if (PayLoad) {
            this.display_name = PayLoad.display_name;
            this.login = PayLoad.login;
        } else {
            console.error('Failed to retrieve user data from server');
        }
    }

    // async load() {
    //     let PayLoad = await fetch(`https://duo.shuttleapp.rs/api/users/${this.id}`) 
    //     .then(res => res.json())
    //     this.display_name = PayLoad.display_name
    //     this.login = PayLoad.login
    //     // .then(result => {

    //     //         this.display_name = result.display_name
    //     //         this.login = result.login
            
    //     //         return result;
    //     // })
    // }
}