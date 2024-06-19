import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithRedirect,
  signInWithPopup,
  GoogleAuthProvider, 
} from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc,} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBWO4lFNkbRT0aPJ-OMKtU6qD7a726bGuc",
  authDomain: "crwn-clothing-ab.firebaseapp.com",
  projectId: "crwn-clothing-ab",
  storageBucket: "crwn-clothing-ab.appspot.com",
  messagingSenderId: "794649289801",
  appId: "1:794649289801:web:9d3e1e5de531912e960b98",
};

const firebaseApp = initializeApp(firebaseConfig);

const provider = new GoogleAuthProvider();

provider.setCustomParameters({
  prompt: "select_account",
}); 

export const auth = getAuth();
export const signInWithGooglePopup = () => signInWithPopup(auth, provider);

export const db = getFirestore();

export const createUserDocumentFromAuth = async (userAuth) => {
  const userDocRef = doc(db, 'users', userAuth.uid);

  const userSnapshot = await getDoc(userDocRef);
 
  if(!userSnapshot.exists()) {
    const { displayName, email } = userAuth;
    const createAt = new Date();

  try {
    await setDoc(userDocRef, {
      displayName,
      email,
      createAt 
    }); 
  } catch (error) {
    console.log('error creating the user', error.message);
  }
}

  return userDocRef;
};
