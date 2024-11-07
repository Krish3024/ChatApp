import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { collection, doc, getDocs, getFirestore, query, setDoc, where } from "firebase/firestore"; // Use lowercase 'firestore'
import { toast } from 'react-toastify';

const firebaseConfig = {
  apiKey: "AIzaSyA2VGjvXtkICY_p9uR_ttw6jDux336Tv3I",
  authDomain: "react-chat-app-73c32.firebaseapp.com",
  projectId: "react-chat-app-73c32",
  storageBucket: "react-chat-app-73c32.appspot.com",
  messagingSenderId: "144567871464",
  appId: "1:144567871464:web:df99475eb4d3731fcb665d"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const signup = async (username, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await setDoc(doc(db, "users", user.uid), {
      id: user.uid,
      username: username.toLowerCase(),
      email,
      name: "",
      avatar: "",
      bio: "Hey there, I'm using chat app",
      lastSeen: Date.now()
    });
    await setDoc(doc(db, "chats", user.uid), {
      chatsData: []
    });
  } catch (error) {
    console.error(error);
    toast.error(error.code.split('/')[1].split('-').join(" "));
  }
};

const login = async (email,password) => {
    try {
        await signInWithEmailAndPassword(auth,email,password);
    } catch (error) {
        console.error(error);
        toast.error(error.code.split('/')[1].split('-').join(" "));
    }
}

const logout = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error(error);
        toast.error(error.code.split('/')[1].split('-').join(" "));
    }
}

const resetPass = async (email) => {
  if (!email) {
    toast.error("Enter your email");
    return null;
  }
  try {
    const userRef = collection(db,'users');
    const q = query(userRef,where("email","==",email));
    const querySnap = await getDocs(q);
    if (!querySnap.empty) {
      await sendPasswordResetEmail(auth,email);
      toast.success("Reset Email sent successfully")
    }
    else{
      toast.error("Email does not exist")
    }
  } catch (error) {
    console.error(error);
    toast.error(error.message);
  }
}

export { signup,login,logout,auth,db,resetPass };