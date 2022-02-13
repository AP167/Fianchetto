import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'
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

function signUpWithEmailPass(email, password, gotoNextPage){

	const app=initApp();
	const auth = getAuth(app);
	var status='success';
	createUserWithEmailAndPassword(auth, email, password)
	  .then((userCredential) => {
	    // Signed in 
	    const user = userCredential.user;
	    console.log("Sign Up Success");
		gotoNextPage(status, user.uid)
	  })
	  .catch((error) => {
	    const errorCode = error.code;
	    const errorMessage = error.message;
	    console.log("Sign Up Failed"+errorCode);
	    status = errorCode;
		gotoNextPage(status, null)
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
		console.log("uid", user.uid)
		gotoNextPage(status, user.uid)
	  })
	  .catch((error) => {
	   const errorCode = error.code;
	    const errorMessage = error.message;
	    console.log("Sign In Failed"+errorCode);
	    status = errorCode;
		gotoNextPage(status, null)
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
