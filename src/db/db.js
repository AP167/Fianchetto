import { initializeApp } from 'firebase/app';
import {getFirestore, doc, setDoc , getDoc} from "firebase/firestore";

// import {nextPage} from "../components/SignIn"

function initApp(){
const firebaseConfig = {
   apiKey: "AIzaSyDMGuhAdH-hQFfuHKfi8WdbL3uwDlEtrJg",
  authDomain: "fianchettoweb.firebaseapp.com",
  projectId: "fianchettoweb",
  storageBucket: "fianchettoweb.appspot.com",
  messagingSenderId: "909152325887",
  appId: "1:909152325887:web:de525a29fc38dc384dfcca"
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
