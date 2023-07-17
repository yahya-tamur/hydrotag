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
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const passwordCheck = () => {
    // Checks for at least 6 characters, 1 letter and 1 number
    const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    return re.test(password);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
    }}>
      <h1 style={{
        margin: '0',
        fontSize: '2em',
        backgroundColor: 'grey',
        padding: '10px',
        textAlign: 'center'
      }}>Hydro Tag App</h1>

      <div style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexGrow: 1,
        backgroundColor: 'teal',
        padding: '1em',
      }}>
        <div style={{
          maxWidth: '450px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: 'white',
          padding: '30px',
          margin: '5%',
        }}>
          {!isSignup ?
            //...login form
            <div style={{ width: '100%' }}>
              <h2 style={{ fontSize: '1.8em' }}>Login</h2>
              <p style={{ fontSize: '1.4em' }}>Don't have an account yet? <a href="#" onClick={() => setIsSignup(true)}>Sign up</a></p>
              <label style={{ fontSize: '1.4em' }}>
                Email Address:
                <input type="text" value={email} onChange={(e) => { setEmail(e.target.value) }} />
              </label>
              <br />
              <label style={{ fontSize: '1.4em' }}>
                Password:
                <input type="password" value={password} onChange={(e) => { setPassword(e.target.value) }} />
              </label>
              <br /><br />
              <button onClick={() => signInWithEmailAndPassword(auth, email, password)} style={{ fontSize: '1.4em' }}>
                Submit
              </button>
            </div>
            :
            //...signup form
            <div style={{ width: '100%' }}>
              <h2 style={{ fontSize: '1.8em' }}>Sign up</h2>
              <label style={{ fontSize: '1.4em' }}>
                Email Address:
                <input type="text" value={email} onChange={(e) => { setEmail(e.target.value) }} />
              </label>
              <br />
              <label style={{ fontSize: '1.4em' }}>
                Password:
                <input type="password" value={password} onChange={(e) => { setPassword(e.target.value) }} />
              </label>
              <p>{passwordCheck() ? '' : 'Password must be at least 6 characters, with at least one letter and one number.'}</p>
              <br />
              <label style={{ fontSize: '1.4em' }}>
                Confirm Password:
                <input type="password" value={check} onChange={(e) => { setCheck(e.target.value) }} />
              </label>
              <br /><br />
              <button
                onClick={async (e) => {
                  e.preventDefault();
                  if (!passwordCheck()) {
                    setErrorMsg("Password does not meet the requirements.");
                    return;
                  }
                  if (password !== check) {
                    setErrorMsg("Passwords don't match!");
                    return;
                  }
                  try {
                    let x = await createUserWithEmailAndPassword(auth, email, password);
                    await setDoc(doc(db, "users", x.user.uid), { email: email });
                    setErrorMsg("");
                    setSuccessMsg("Your account has been created. You can now log in.");
                  } catch (error) {
                    setErrorMsg(error.message);
                  }
                }}
                style={{ fontSize: '1.4em' }}
              >
                Submit
              </button>
              <p style={{ color: 'green' }}>{successMsg}</p>
              <p style={{ color: 'red' }}>{errorMsg}</p>
              <button type="button" onClick={() => setIsSignup(false)} style={{ fontSize: '1.4em' }}>
                Go Back
              </button>
            </div>
          }
        </div>
        <div style={{
          flex: 1,
          padding: '0 2em',
          display: 'flex',
          flexDirection: 'column',
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
