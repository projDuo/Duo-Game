import { Auth } from './api/apiAuth.js';
import { WebSocketManager } from './api/gateWay.js';       
import * as playerMenu from "./playerMenu.js";    
import * as duoGame from "./duoGame.js"; 
import { activeMenu } from './playerMenu.js';    

export let globalToken = ""

export async function load(){
    const response = await fetch("auth.html")
    const text = await response.text();
    document.getElementById('menu').innerHTML = text;


    const authorization = document.getElementById("authorization");

    document.getElementById("register").addEventListener("click", function() {
        authorization.classList.add("active");
    });
    document.getElementById("signIn").addEventListener("click", function() {
        authorization.classList.remove("active");
    });
    document.getElementById("guest").addEventListener("click", function() {
        authorization.classList.add("activeGuest");
    });
    document.getElementById("signIns").addEventListener("click", function() {
        authorization.classList.remove("activeGuest");
    });

    const url = 'wss://duo.shuttleapp.rs/api/gateway';

    async function gate(response) {
        const gateway = new WebSocketManager(url);
        await gateway.connect();
        const token = await response.text();
        await gateway.identify(token);

        globalToken = token;
    }

    //! Register
    document.getElementById("loginUp").addEventListener("click", function(){
        const login = document.getElementById("loginUp")
        if (login.value === "This login is already taken") {
            login.value = "";
        }
    });
    document.getElementById("registrationForm").addEventListener('submit', function(event){
        event.preventDefault();
        const login = document.getElementById("loginUp");
        const password = document.getElementById("passwordUp");
        const confirmPassword = document.getElementById("confirmPassword");
        const correctPassword = document.getElementById("correctPassword")
        const accountReg = new Auth(login, password)

        if(password.value !== confirmPassword.value){
            correctPassword.innerText = "Please, repeat your password correctly"
            return;
        }

        accountReg.register().then(response => {
            if(response.status === 200){
                gate(response)
            }else if(response.status === 409){
                login.value = "This login is already taken";
                password.value = "";
                confirmPassword.value = "";
            }else if(response.status === 502){
                login.value = "Server dead";
                password.value = "Server dead";
                confirmPassword.value = "Server dead";
            }else{
                console.log("Unknown error")
            }
        })
    });
    //! Register
    //? Login
    document.getElementById("loginIn").addEventListener("click", function(){
        const login = document.getElementById("loginIn")
        if (login.value === "This account does not exist") {
            login.value = "";
        }
    })
    document.getElementById("loginForm").addEventListener('submit', function(event){
        event.preventDefault();
        const login = document.getElementById("loginIn");
        const password = document.getElementById("passwordIn");
        const accountLog = new Auth(login, password)

        accountLog.auth().then(response => {
            if(response.status === 403){
                document.getElementById("checkPassword").innerText = "Invalid password, please try again"
            }else if(response.status === 404){
                login.value = "This account does not exist"
                password.value = ""
            }else if(response.status === 502){
                login.value = "Server dead";
                password.value = "Server dead";
            }else if(response.status === 200){ 
                gate(response)
            }
        })
    });
    //? Login
    //! Guest 
    // document.getElementById("loginGu").addEventListener("click", function(){
    //     const login = document.getElementById("loginGu")
    //     if (login.value === "This login is already taken") {
    //         login.value = "";
    //     }
    // });

    // document.getElementById("guestForm").addEventListener('submit', function(event){
    //     event.preventDefault();
    //     const login = document.getElementById("loginGu");
    //     (async () => {
    //         await gateway.connect();
    //         const token = await response.body;
    //         await gateway.identify(token);
    //         console.log("AAA");
    //     })();

    // });
    //! Guest 
}