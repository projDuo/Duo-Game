import { api } from "./apiPath.js" // Імпортування серверу

export class Auth{  // Клас реєстрації та входу
    constructor(login, password){
        this.login = login
        this.password = password
    }

    formAuthReq(){  // Формування запросу на сервер
        const data = {
            login: this.login.value,
            password: this.password.value};
        const jsonBody = JSON.stringify(data);
        return jsonBody
    }

    register(){  // Метод реєстрації
        return fetch(api + "/auth/register", {method: "POST", headers:{"Content-type": "Application/json"}, body: this.formAuthReq()}) // Відправка форми реєстрації на сервер
        .then(result => {
            return result  // Отримання результата реєстрації від серверу
        })
    }

    auth(){  // Метод автентифікації
        return fetch(api + "/auth/login", {method: "POST", headers:{"Content-type": "Application/json"}, body: this.formAuthReq()})  // Відправка форми автентифікації на сервер
        .then(result => {
            return result  // Отримання результата автентифікації від серверу
        })
    }
}