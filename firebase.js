import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyAdE1hyBUf0CSOVnWvLm2G7k93ovp-Pido",
    authDomain: "pawfinity-ee43e.firebaseapp.com",
    projectId: "pawfinity-ee43e",
    storageBucket: "pawfinity-ee43e.appspot.com",
    messagingSenderId: "794279967659",
    appId: "1:794279967659:web:84e602912bf2e0f432f0ee",
    measurementId: "G-7XY7CPJ5GE"
};

const firebaseapp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseapp);

export default storage