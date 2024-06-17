import { Auth } from './api/apiAuth.js';
import { WebSocketManager } from './api/gateWay.js';       
import * as playerMenu from "./playerMenu.js";    
import * as duoGame from "./duoGame.js"; 
import { activeMenu } from './playerMenu.js';    

export let globalToken = ""

const url = 'wss://duo.shuttleapp.rs/api/gateway';

export async function gate(token) {
    const gateway = new WebSocketManager(url);
    await gateway.connect();
    await gateway.identify(token);

    globalToken = token;
}

export async function load(){
    const response = await fetch("auth.html")
    const text = await response.text();
    document.getElementById('menu').innerHTML = text;
    document.getElementById("menu").style.display = "flex"

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

    //! Register
    document.getElementById("loginUp").addEventListener("click", function(){
        const login = document.getElementById("loginUp")
        if (login.value === "This login is already taken") {
            login.value = "";
        }
    });

    document.getElementById("passwordUp").addEventListener("click", function(){
        const password = document.getElementById("passwordUp")
        if(password.value === "Password must be over 6 characters"){
            password.value = ""
            password.type = "password"
        }
    })

    document.getElementById("registrationForm").addEventListener('submit', function(event){
        event.preventDefault();
        const login = document.getElementById("loginUp");
        const password = document.getElementById("passwordUp");
        const confirmPassword = document.getElementById("confirmPassword");
        const correctPassword = document.getElementById("correctPassword")
        if(password.value.length >= 6){
            const accountReg = new Auth(login, password)

            if(password.value !== confirmPassword.value){
                correctPassword.innerText = "Please, repeat your password correctly"
                return;
            }
    
            accountReg.register().then(async response => {
                if(response.status === 200){
                    let res = await response.text()
                    duoGame.setCookie("cookieToken", res, 1)
                    gate(res)
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
        }else{
            password.value = ""
            confirmPassword.value = ""
            password.type = "text"
            password.value = "Password must be over 6 characters"
        }
    });
    //! Register
    //? Login
    document.getElementById("loginIn").addEventListener("click", function(){
        const login = document.getElementById("loginIn")
        if (login.value === "This account does not exist") {
            login.value = "";
        }
    })

    document.getElementById("passwordIn").addEventListener("click", function(){
        const password = document.getElementById("passwordIn")
        if(password.value === "Password must be over 6 characters"){
            password.value = ""
            password.type = "password"
        }
    })

    document.getElementById("loginForm").addEventListener('submit', function(event){
        event.preventDefault();
        const login = document.getElementById("loginIn");
        const password = document.getElementById("passwordIn");
        if(password.value.length >= 6){
            const accountLog = new Auth(login, password)

            accountLog.auth().then(async response => {
                if(response.status === 403){
                    document.getElementById("checkPassword").innerText = "Invalid password, please try again"
                }else if(response.status === 404){
                    login.value = "This account does not exist"
                    password.value = ""
                }else if(response.status === 502){
                    login.value = "Server dead";
                    password.value = "Server dead";
                }else if(response.status === 200){ 
                    let res = await response.text()
                    duoGame.setCookie("cookieToken", res, 1)
                    gate(res)
                    duoGame.getCookie("cookieToken")
                }
            })
        }else{
            password.value = ""
            password.type = "text"
            password.value = "Password must be over 6 characters"
        }
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