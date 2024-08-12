import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {getFirestore} from 'firebase/firestore'
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDsAkVyAjWpnOu05D1wMdHZuEmBEiU1GkY",
  authDomain: "mychat-8aa01.firebaseapp.com",
  projectId: "mychat-8aa01",
  storageBucket: "mychat-8aa01.appspot.com",
  messagingSenderId: "999057580148",
  appId: "1:999057580148:web:b436963af51d71267eb121",
  measurementId: "G-8KKCTTT8TV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

const storage = getStorage(app);

export {db, auth, app, storage};