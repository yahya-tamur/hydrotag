import { useState } from 'react';
import { useRouter } from 'next/router';
import Map from '../components/Map';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
// import Search from './Search'; // Import the Search component
//<Search /> {} //search component .... this goes before map in return()

import { app } from '../app';
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
    } catch (error) {
      console.log(error);
    }
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
        <h1 style={{ margin: '0', fontSize: '2em' }}>Hydro Tag App</h1>
      </div>
      <div style={{
        display: 'flex',
        height: 'calc(100vh - 2em)',
        width: `100%`,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingRight: '1em',
        paddingLeft: auth.currentUser ? '30%' : '0',
      }}>
        {!auth.currentUser && (
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            width: '100%'
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
              marginBottom: '5%',
              marginLeft: '2em', // Small adjustment here
              marginTop: '4%', // Adjusted margin top here
            }}>
              {!isSignup ?
                //...login form
                <form onSubmit={handleSignin} style={{ width: '80%' }}>
                  <h2 style={{ fontSize: '1.5em' }}>Login</h2>
                  <p style={{ fontSize: '1.2em' }}>Don't have an account yet? <a href="#" onClick={() => setIsSignup(true)}>Sign up</a></p>
                  <label style={{ fontSize: '1.2em' }}>
                    Email Address:
                    <input type="text" value={email} onChange={handleEmailChange} />
                  </label>
                  <br></br>
                  <label style={{ fontSize: '1.2em' }}>
                    Password:
                    <input type="password" value={password} onChange={handlePassChange} />
                  </label>
                  <br></br><br></br>
                  <button type="submit" style={{ fontSize: '1.2em' }}>
                    Submit
                  </button>
                </form>
                :
                //...signup form
                <form onSubmit={submit} style={{ width: '80%' }}>
                  <h2 style={{ fontSize: '1.5em' }}>Sign up</h2>
                  <label style={{ fontSize: '1.2em' }}>
                    Email Address:
                    <input type="text" value={email} onChange={handleEmailChange} />
                  </label>
                  <br></br>
                  <label style={{ fontSize: '1.2em' }}>
                    Password:
                    <input type="password" value={password} onChange={handlePassChange} />
                  </label>
                  <br></br>
                  <label style={{ fontSize: '1.2em' }}>
                    Confirm Password:
                    <input type="password" value={check} onChange={handleCheck} />
                  </label>
                  <br></br><br></br>
                  <button type="submit" style={{ fontSize: '1.2em' }}>
                    Submit
                  </button>
                  <button type="button" onClick={() => setIsSignup(false)} style={{ fontSize: '1.2em' }}>
                    Go Back
                  </button>
                </form>
              }
              </div>
              <div style={{
                width: '60%',
                paddingRight: '2em',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}>
                <h1 style={{ fontSize: '3em' }}>Welcome to the Hydro Tag App!</h1>
                <p className="double-spaced" style={{ fontSize: '1.5em', textAlign: 'justify' }}>
                HydroTag is your comprehensive companion for discovering, tracking, and reviewing water sources in your vicinity. With an aim to make finding quality water convenient and personalized, HydroTag provides a platform to explore water sources around you, along with valuable insights on their quality, based on user reviews. You can easily pin your findings on the map, see pins from your friends, and contribute to the community through your own reviews. HydroTag isn't just an app, but a community dedicated to sharing the best hydration spots, ensuring you and your friends never have to compromise on the quality of water you consume. Start your personalized water discovery journey with HydroTag today!
              </p>
            </div>
          </div>
        )}
        {auth.currentUser && (
          <div style={{
            width: '70%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '1em'
          }}>
            <h1 style={{ fontSize: '3em' }}>Welcome {auth.currentUser.email}</h1>
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
  )
}
