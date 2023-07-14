import { useState } from 'react';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getFirestore } from 'firebase/firestore';

import { app } from '../app';
const auth = getAuth(app);
const db = getFirestore(app);

export default function Index() {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [check, setCheck] = useState('');

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
    }}>
      <h1 style={{
        margin: '0',
        fontSize: '2em',
        backgroundColor: 'grey',
        paddingBottom: '10pt',
        paddingTop: '10pt',
        textAlign: 'center'
      }}>Hydro Tag App</h1>

      <div style={{
        display: 'flex',
        height: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingRight: '1em',
        backgroundColor: 'teal',
      }}>
        <div style={{
          width: '350px',
          height: '300px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'white',
          padding: '20px',
          margin: '5%', // Small adjustment here
        }}>
          {!isSignup ?
            //...login form
            <div style={{ width: '80%' }}>
              <h2 style={{ fontSize: '1.5em' }}>Login</h2>
              <p style={{ fontSize: '1.2em' }}>Don't have an account yet? <a href="#" onClick={() => setIsSignup(true)}>Sign up</a></p>
              <label style={{ fontSize: '1.2em' }}>
                Email Address:
                <input type="text" value={email} onChange={(e) => { setEmail(e.target.value) }} />
              </label>
              <br />
              <label style={{ fontSize: '1.2em' }}>
                Password:
                <input type="password" value={password} onChange={(e) => { setPassword(e.target.value) }} />
              </label>
              <br /><br />
              <button onClick={() => signInWithEmailAndPassword(auth, email, password)} style={{ fontSize: '1.2em' }}>
                Submit
              </button>
            </div>
            :
            //...signup form
            <div style={{ width: '80%' }}>
              <h2 style={{ fontSize: '1.5em' }}>Sign up</h2>
              <label style={{ fontSize: '1.2em' }}>
                Email Address:
                <input type="text" value={email} onChange={(e) => { setEmail(e.target.value) }} />
              </label>
              <br />
              <label style={{ fontSize: '1.2em' }}>
                Password:
                <input type="password" value={password} onChange={(e) => { setPassword(e.target.value) }} />
              </label>
              <br />
              <label style={{ fontSize: '1.2em' }}>
                Confirm Password:
                <input type="password" value={check} onChange={(e) => { setCheck(e.target.value) }} />
              </label>
              <br /><br />
              <button
                onClick={async (e) => {
                  e.preventDefault();
                  if (password !== check) {
                    alert("passwords don't match!");
                    return;
                  }
                  try {
                    let x = await createUserWithEmailAndPassword(auth, email, password);
                    await setDoc(doc(db, "users", x.user.uid), { email: email });
                  } catch (error) {
                    alert(error.message);
                  }
                }}
                style={{ fontSize: '1.2em' }}
              >
                Submit
              </button>
              <button type="button" onClick={() => setIsSignup(false)} style={{ fontSize: '1.2em' }}>
                Go Back
              </button>
            </div>
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
          <p style={{ lineHeight: 2, fontSize: '1.5em', textAlign: 'justify' }}>
            HydroTag is your comprehensive companion for discovering,
            tracking, and reviewing water sources in your vicinity.
            With an aim to make finding quality water convenient and
            personalized, HydroTag provides a platform to explore
            water sources around you, along with valuable insights on
            their quality, based on user reviews. You can easily pin
            your findings on the map, see pins from your friends, and
            contribute to the community through your own reviews.
            HydroTag isn't just an app, but a community dedicated to
            sharing the best hydration spots, ensuring you and your
            friends never have to compromise on the quality of water
            you consume. Start your personalized water discovery
            journey with HydroTag today!
          </p>
        </div>
      </div>
    </div>
  )
}
