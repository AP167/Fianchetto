import { initializeApp } from 'firebase/app';
import {getFirestore, doc, setDoc , getDoc} from "firebase/firestore";

// import {nextPage} from "../components/SignIn"

function initApp(){
const firebaseConfig = {
  apiKey: "AIzaSyDuVuumoKaV9F17ZszZXp3FHYV2rcy-ig0",
  authDomain: "fianchetto-b5d9d.firebaseapp.com",
  databaseURL: "https://fianchetto-b5d9d-default-rtdb.firebaseio.com",
  projectId: "fianchetto-b5d9d",
  storageBucket: "fianchetto-b5d9d.appspot.com",
  messagingSenderId: "139019014751",
  appId: "1:139019014751:web:8cbb1bd7b2c6ad92d881ea",
  measurementId: "G-N2ZDXWBXLE"
};

const app = initializeApp(firebaseConfig);
return app;
}
var app=initApp()
const db = getFirestore(app)

async function writeUserData(username, email) {
  await setDoc(doc(db, "FianchettoUsers", username), {
  email: email
});
}

async function getUserData(username){
    const docRef = doc(db, "FianchettoUsers", username);
    const docSnap = await getDoc(docRef);
    if(docSnap.exist()){
        console.log("user data: ", docSnap.data())
        return docSnap.data();
    }
    else{
        console.log("No user found")
        return null;
    }
}



export {getUserData, writeUserData}
