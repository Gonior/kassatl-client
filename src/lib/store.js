// src/stores/content.js
import { writable } from 'svelte/store'

// // Get the value out of storage on load.
// const stored = localStorage.translateReverse ? JSON.parse(localStorage.translateReverse) : ""
// // or localStorage.getItem('content')

// // Set the stored value or a sane default.
// export const reverse = writable( stored || false)

// // Anytime the store changes, update the local storage value.
// reverse.subscribe((value) => localStorage.translateReverse = JSON.stringify(value))
// // or localStorage.setItem('content', value)

const themes = localStorage.theme ? localStorage.theme : "light"
export const theme = writable(themes || "light")
theme.subscribe(value => localStorage.theme = value)

export const BASE_URL =  "https://kassatl.glitch.me" 

export const SUPPORT_CAMERA = writable({support :false, permission : ""})