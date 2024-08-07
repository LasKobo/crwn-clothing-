import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithRedirect,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,  
} from "firebase/auth";
// import { get } from "firebase/database";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc, 
  collection,
  writeBatch,
  query,
  getDocs
} from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyBWO4lFNkbRT0aPJ-OMKtU6qD7a726bGuc",
  authDomain: "crwn-clothing-ab.firebaseapp.com",
  projectId: "crwn-clothing-ab",
  storageBucket: "crwn-clothing-ab.appspot.com",
  messagingSenderId: "794649289801",
  appId: "1:794649289801:web:9d3e1e5de531912e960b98",
};

const firebaseApp = initializeApp(firebaseConfig);

const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: "select_account",
});

export const auth = getAuth();
export const db = getFirestore();
export const signInWithGooglePopup = () =>
   signInWithPopup(auth, googleProvider);
export const signInWithGoogleRedirect = () =>
   signInWithRedirect(auth, googleProvider);

export const addCollectionAndDocuments = async (
  collectionKey, 
  objectsAdd,
  field
) => {
  const collectionRef = collection(db, collectionKey);
  const batch = writeBatch(db);

  objectsAdd.forEach((object) => {
    const docRef = doc(collectionRef, object.title.toLowerCase());
    batch.set(docRef, object);
  });

  await batch.commit();
  console.log('done'); 
}; 

export const getCategoriesAndDocuments = async () => {
  const collectionRef = collection(db, 'categories');
  const q = query(collectionRef); 

  const querySnapshot = await getDocs(q);
  const categoryMap = querySnapshot.docs.reduce((acc, docSnapshop) => {
    const { title, items } = docSnapshop.data();
    acc[title.toLowerCase()] = items;
    return acc;
  }, {});

  return categoryMap;
} 

 export const createUserDocumentFromAuth = async (
  userAuth, 
  additionalInformation = {}
) => {
  if (!userAuth) return;

// console.log('userAuth', userAuth);
// console.log('additionalInformation', additionalInformation);

  const userDocRef = doc(db, 'users', userAuth.uid);

  const userSnapshot = await getDoc(userDocRef);

  if (!userSnapshot.exists()) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();

    try {
      await setDoc(userDocRef, {
        displayName,
        email,
        createdAt,
        ...additionalInformation
      });
    } catch (error) {
      console.error('Error creating the user document', error);
    }
  }  

  return userDocRef;
};

export const createAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;

   return await createUserWithEmailAndPassword (auth, email, password);
};

export const signInAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;

   return await signInWithEmailAndPassword(auth, email, password);
};
export const signOutUser = async () => await signOut(auth);

export const onAuthStateChangedListener = (callback) => 
  onAuthStateChanged(auth, callback)