import {useState} from 'react';
import {useRouter} from 'next/router'
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth";
import Image from 'next/image'

const firebaseConfig = {
  apiKey: "AIzaSyAbHmwNNmKYkrE253miq789vVJn_zr2evM",
  authDomain: "hydrotag-27a6b.firebaseapp.com",
  projectId: "hydrotag-27a6b",
  storageBucket: "hydrotag-27a6b.appspot.com",
  messagingSenderId: "334077048073",
  appId: "1:334077048073:web:32ada1c61c1d7093a6cfd8"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)

export default function loginForm() {
  const [email, setEmail] = useState('');  
  const [password, setPassword] = useState('');
  const router = useRouter()
  
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  }
  const handlePassChange = (event) => {
    setPassword(event.target.value);
  }
  const handleSign = (event) => {
    event.preventDefault();
    console.log(email)
    console.log(password)
    //if(submitType == 'in') {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("Signed in successfully")
        const user = userCredential.user;
        router.push("/")
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(error.code + error.message)
      });
    //}
    /*else if(submitType == 'up') {
      createUserWithEmailAndPassword(auth, username, password)
      .then((userCredential) => {

      })
    }*/
    // Send the login data to your server
  }

  return (
    <form onSubmit={handleSign}>   
      <Image 
      src="/logo.png"
      width={500}
      height={500}
      alt="logo"
      />
      <style>

      </style>
      <label>
        Email:
        <input type="text" value={email} onChange= {handleEmailChange} />
      </label>
      <label>
        Password:
        <input type="text" value={password} onChange= {handlePassChange} />
      </label>
      <button type="submit" value='in' id= "button">
        Submit
      </button>
    </form>
  );
  }
