import * as playerMenu from "./playerMenu.js";
import * as auth from "./auth.js";
import { Profile } from "./api/profile.js";

export let logged_as = Profile.New(null, null, null, null)

export function logged_asSet(value){
    logged_as = value
}

// Коли розберуся з кукі
document.addEventListener('DOMContentLoaded', () => {
    auth.load()
});

