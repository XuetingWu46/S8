import { initializeApp } from 'firebase/app';
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyA08Nytgecwzutk0uAXavWQmg3E5u1yUtA",
    authDomain: "syn8-1998f.firebaseapp.com",
    // // The value of `databaseURL` depends on the location of the database
    // databaseURL: "https://DATABASE_NAME.firebaseio.com",
    projectId: "syn8-1998f",
    storageBucket: "syn8-1998f.appspot.com",
    messagingSenderId: "751920335285",
    appId: "1:751920335285:android:e6dfa143f4ea3f0c44b1fc",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);

export const alphaVantage_ApiKey = "Y1FE4XJ5VRYCHW8F";

