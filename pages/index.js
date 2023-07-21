import { useState } from 'react';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getFirestore } from 'firebase/firestore';
import { Box, Typography, Grid, TextField, Button, GlobalStyles } from '@mui/material';
import { app } from '../app';

const auth = getAuth(app);
const db = getFirestore(app);

export default function Index() {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [check, setCheck] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const passwordCheck = () => {
    const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    return re.test(password);
  };

  return (
    <>
      <GlobalStyles styles={{
        body: {
          margin: 0,
          padding: 0,
          boxSizing: 'border-box',
          fontFamily: 'sans-serif',
        },
        'h1, h2, h3, h4, h5, h6, p, ul, ol, li, a, button, input, select, textarea': {
          margin: 0,
          padding: 0,
        }
      }} />

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          backgroundColor: 'white'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#209cee',
            color: 'white',
            padding: '10px'
          }}
        >
          <Typography variant="h3">HydroTag App</Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            padding: '1em',
            flexGrow: 1
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: '#F0F0F0',
              padding: '30px',
              margin: '5%',
              maxWidth: '450px',
              width: '100%'
            }}
          >
            <img src="/logo.png" alt="Logo" />
            {!isSignup ?
              <Grid
                container
                direction="column"
                alignItems="stretch"
                spacing={2}
              >
                <Grid item>
                  <Typography variant="h4">Login</Typography>
                  <Typography variant="subtitle1">
                    Don't have an account yet?{' '}
                    <a href="#" onClick={() => setIsSignup(true)}>
                      Create a HydroTag account.
                    </a>
                  </Typography>
                </Grid>
                <Grid item>
                  <TextField
                    label="Email Address"
                    type="text"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    fullWidth
                  />
                </Grid>
                <Grid item>
                  <TextField
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                    fullWidth
                  />
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    onClick={async () => {
                      try {
                        await signInWithEmailAndPassword(auth, email, password);
                      } catch (error) {
                        if (error.code === 'auth/wrong-password') {
                          setErrorMsg('Incorrect password.');
                        } else if (error.code === 'auth/user-not-found') {
                          setErrorMsg('No user found with this email.');
                        } else {
                          setErrorMsg(error.message);
                        }
                      }
                    }}
                    sx={{ bgcolor: '#209cee', color: 'white' }}
                  >
                    Submit
                  </Button>
                  <p style={{ color: 'red' }}>{errorMsg}</p>
                </Grid>
              </Grid>
              :
              <Grid
                container
                direction="column"
                alignItems="stretch"
                spacing={2}
              >
                <Grid item>
                  <Typography variant="h4">Sign Up</Typography>
                </Grid>
                <Grid item>
                  <TextField
                    label="Email Address"
                    type="text"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    fullWidth
                  />
                </Grid>
                <Grid item>
                  <TextField
                    label="Username"
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                    fullWidth
                  />
                </Grid>
                <Grid item>
                  <TextField
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                    fullWidth
                  />
                  <p style={{ color: 'red' }}>{passwordCheck() ? '' : 'Password must be at least 6 characters, with at least one letter and one number.'}</p>
                </Grid>
                <Grid item>
                  <TextField
                    label="Confirm Password"
                    type="password"
                    value={check}
                    onChange={(e) => {
                      setCheck(e.target.value);
                    }}
                    fullWidth
                  />
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    onClick={async (e) => {
                      e.preventDefault();
                      if (!passwordCheck()) {
                        setErrorMsg('Password does not meet the requirements.');
                        return;
                      }
                      if (password !== check) {
                        setErrorMsg("Passwords don't match!");
                        return;
                      }
                      try {
                        let x = await createUserWithEmailAndPassword(auth, email, password);
                        await setDoc(doc(db, 'users', x.user.uid), { email: email, name: name, markers: 0, reviews: 0, following: 0, followers: 0, bio: "" });
                        setErrorMsg('');
                        setSuccessMsg('Your account has been created. You can now log in.');
                      } catch (error) {
                        if (error.code === 'auth/email-already-in-use') {
                          setErrorMsg('Email already exists! Please signup with a new one.');
                        } else {
                          setErrorMsg(error.message);
                        }
                      }
                    }}
                    sx={{ bgcolor: '#209cee', color: 'white' }}
                  >
                    Submit
                  </Button>
                  <p style={{ color: 'green' }}>{successMsg}</p>
                  <p style={{ color: 'red' }}>{errorMsg}</p>
                </Grid>
                <Grid item>
                  <Button variant="contained" onClick={() => setIsSignup(false)}
                    sx={{ bgcolor: '#209cee', color: 'white' }}>
                    Go Back
                  </Button>
                </Grid>
              </Grid>
            }
          </Box>

          <Box sx={{ flex: 1, padding: '0 2em' }}>
            <Typography variant="h2" sx={{ margin: '1em 0', color: '#209cee', fontWeight: 'bold' }}>
              Welcome to the HydroTag App!
            </Typography>
            <Typography variant="h5" sx={{ lineHeight: 2, textAlign: 'justify' }}>
              HydroTag is your comprehensive companion for discovering,
              tracking, and reviewing water sources in your vicinity.
              With an aim to make finding quality water convenient and
              personalized, HydroTag provides a platform to explore
              water sources around you, along with valuable insights on
              their quality, based on user reviews. You can easily pin
              your findings on the map, see pins from your friends, and
              contribute to the community through your own reviews.
              HydroTag isn't just an app, it's a community-driven endeavor
              to promote safe and quality water for everyone. Join the
              HydroTag community today!
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#209cee',
            color: 'white',
            padding: '10px'
          }}
        >
          <Typography>© Copyright 2023 HydroTag - All Rights Reserved </Typography>
        </Box>
      </Box>
    </>
  );
}
