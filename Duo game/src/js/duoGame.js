import * as playerMenu from "./playerMenu.js";
import * as auth from "./auth.js";
import { Profile } from "./api/profile.js";

export let logged_as = Profile.New(null, null, null, null)

export function logged_asSet(value){
    logged_as = value
}

document.addEventListener('DOMContentLoaded', () => {
    let cook = getCookie("cookieToken") 
    if(cook === ""){
        auth.load()
    }else{
        document.getElementById("menu").style.display = "none"
        auth.gate(cook)
    }

});


export function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }
  
export  function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }