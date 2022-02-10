import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'
// import {nextPage} from "../components/SignIn"

function initApp(){
const firebaseConfig = {
  apiKey: "AIzaSyDuVuumoKaV9F17ZszZXp3FHYV2rcy-ig0",
  authDomain: "fianchetto-b5d9d.firebaseapp.com",
  projectId: "fianchetto-b5d9d",
  storageBucket: "fianchetto-b5d9d.appspot.com",
  messagingSenderId: "139019014751",
  appId: "1:139019014751:web:8cbb1bd7b2c6ad92d881ea",
  measurementId: "G-N2ZDXWBXLE"
};

const app = initializeApp(firebaseConfig);
return app;
}

function signUpWithEmailPass(email, password, gotoNextPage){

	const app=initApp();
	const auth = getAuth(app);
	var status='success';
	createUserWithEmailAndPassword(auth, email, password)
	  .then((userCredential) => {
	    // Signed in 
	    const user = userCredential.user;
	    console.log("Sign Up Success");
		gotoNextPage(status)
	  })
	  .catch((error) => {
	    const errorCode = error.code;
	    const errorMessage = error.message;
	    console.log("Sign Up Failed"+errorCode);
	    status = errorCode;
		gotoNextPage(status)
	  });

	return status
}

function signInWithEmailPass(email, password, gotoNextPage){
	const app=initApp();
	const auth = getAuth(app);
	var status='success';
	signInWithEmailAndPassword(auth, email, password)
	  .then((userCredential) => {
	    // Signed in 
	    const user = userCredential.user;
	    console.log("Sign In Success");
		gotoNextPage(status)
	  })
	  .catch((error) => {
	   const errorCode = error.code;
	    const errorMessage = error.message;
	    console.log("Sign In Failed"+errorCode);
	    status = errorCode;
		gotoNextPage(status)
	  });
}



function signOutUser(){
	const app=initApp();
	const auth = getAuth(app);
	signOut(auth).then(() => {
	  console.log("User signed out");
	}).catch((error) => {
	  console.log(error.code);
	});
 }
export {signInWithEmailPass, signUpWithEmailPass, signOutUser}
