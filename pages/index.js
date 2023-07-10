import { useState } from 'react';
import { useRouter } from 'next/router';
import Map from '../components/Map';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';

import {app} from '../app';
const auth = getAuth(app);
const db = getFirestore(app);

export default function Home() {

  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');  
  const [password, setPassword] = useState('');
  const [check, setCheck] = useState('');

  const router = useRouter();

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  }
  const handlePassChange = (event) => {
    setPassword(event.target.value);
  }
  const handleCheck = (event) => {
    setCheck(event.target.value);
  }
  const handleSignin = (event) => {
    event.preventDefault();

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("Signed in successfully")
        const user = userCredential.user;
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(error.code + error.message)
      });
  }

  const validate = () => {
    if (password !== check) {
        console.log("Passwords do not match");
        return false;
    }
    return true;
  }

  const submit = (event) => {
    event.preventDefault();
    if (!validate()) {
        return false;
    }
    register(email, password);
  }

  const register = async (email, password) => {
    try {
      let x = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", x.user.uid), {
        email: email
      });
      console.log('Sign-up successful. Redirecting to main page...')
      router.push("/");
    } catch { error => console.log(error)}
  }

  return (
    <div style={{ 
      height: `100vh`, 
      width: `100%`, 
      backgroundColor: 'teal', 
      display: 'flex', 
      flexDirection: 'column'
    }}>
      <div style={{ 
        width: '100%', 
        backgroundColor: 'grey', 
        padding: '1em', 
        textAlign: 'center'
      }}>
        <h1 style={{margin: '0'}}>Hydro Tag App</h1>
      </div>
      <div style={{ 
        display: 'flex', 
        height: 'calc(100vh - 2em)', 
        width: `100%`,
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{ 
          width: '30%', 
          minHeight: '40%',
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          backgroundColor: 'white', 
          padding: '2%',
          marginBottom: '5%'
        }}>
          {!isSignup ? 
            <form onSubmit={handleSignin} style={{ width: '80%' }}>   
              <h2>Login</h2>
              <p>Don't have an account yet? <a href="#" onClick={() => setIsSignup(true)}>Sign up</a></p>
              <label>
                Email Address:
                <input type="text" value={email} onChange= {handleEmailChange} />
              </label>
              <br></br>
              <label>
                Password:
                <input type="password" value={password} onChange= {handlePassChange} />
              </label>
              <br></br><br></br>
              <button type="submit">
                Submit
              </button>
            </form>
            :
            <form onSubmit={submit} style={{ width: '80%' }}>   
              <h2>Sign up</h2>
              <label>
                Email Address:
                <input type="text" value={email} onChange= {handleEmailChange} />
              </label>
              <br></br>
              <label>
                Password:
                <input type="password" value={password} onChange= {handlePassChange} />
              </label>
              <br></br>
              <label>
                Confirm Password:
                <input type="password" value={check} onChange= {handleCheck} />
              </label>
              <br></br><br></br>
              <button type="submit">
                Submit
              </button>
              <button type="button" onClick={() => setIsSignup(false)}>
                Go Back
              </button>
            </form>
          }
        </div>
        
        {!auth.currentUser ? null : (
          <div style={{ 
            width: '70%', 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            <h2>{auth.currentUser.uid}</h2>
            <button type="button" onClick={async () => {
              await auth.signOut();
              console.log("signed out.");
              location.reload();
            }}> logout </button>
            <Map />
          </div>
        )}
      </div>
    </div>
  );
}

/*
import React, { useState } from "react";
import { getAuth } from "firebase/auth";
import { useRouter } from 'next/router';
import Map from '../components/Map';

import {app} from '../app';
const auth = getAuth(app);

export default function Home() {

  const router = useRouter();

  return (
    <div style={{ height: `100%`, width: `100%` }} >
      <h1>
        <div className="banner">
          <div className="banner-content">
            <h2>{auth.currentUser?.uid ?? "Guest"}</h2>
            <button type="button" onClick={async () => {
              await auth.signOut();
              console.log("signed out.");
              console.log(auth.currentUser?.uid)
              location.reload();
             }}> logout </button>
            <button type="button" onClick={() => { router.push("login") }}> click here to login </button>
            <button type="button" onClick={() => { router.push("signup") }}> click here to signup </button>
            <p>Hydrotag</p>
          </div>
        </div>
      </h1>
      <Map />


    </div>
  );
}
*/
