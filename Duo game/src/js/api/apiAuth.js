import { api } from "./apiPath.js"

export class Auth{
    constructor(login, password){
        this.login = login
        this.password = password
    }

    formAuthReq(){
        const data = {
            login: this.login.value,
            password: this.password.value};
        const jsonBody = JSON.stringify(data);
        return jsonBody
    }

    register(){
        return fetch(api + "/auth/register", {method: "POST", headers:{"Content-type": "Application/json"}, body: this.formAuthReq()})
        .then(result => {
            return result
        })
    }

    auth(){
        return fetch(api + "/auth/login", {method: "POST", headers:{"Content-type": "Application/json"}, body: this.formAuthReq()})
        .then(result => {
            return result
        })
    }
}