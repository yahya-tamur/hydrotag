import React from "react";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, getDocs, addDoc, serverTimestamp} from 'firebase/firestore';
import { app } from '../app';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
const auth = getAuth(app);
const db = getFirestore(app);

export default function Users() {

  const [emailtext, setEmailText] = React.useState("");
  return (
    <FormControl>
    <FormLabel>Follow User</FormLabel>
    <TextField value={emailtext} onChange={e => {setEmailText(e.target.value)}} placeholder="input userID here..."></TextField>
    <Button onClick={
      async () => {
        const time = serverTimestamp();
        if (!auth.currentUser?.uid) {
          alert("You must be logged in add a friend!");
        }
        else {
          try {
            const q = await getDocs(collection(db, "users"))
            q.forEach(async (u) => {
              console.log(u.data());
              if (u.data().email == emailtext) {
                fuid = u.id;
              }
            });
            if(!fuid) {
              alert("The user " + emailtext + " does not exist!")
            }
            else if (fuid == auth.currentUser.uid) {
              alert("Following yourself is not supported.")
            }
            else {
              console.log(fuid)
              await addDoc(collection(db, "connections"), {
                follower: auth.currentUser.uid,
                following: fuid,
                timestamp: time
              });
              alert("Now following " + emailtext + " since " + time)
            }
          }
          catch (e) {
            console.log(e)
            alert("Error gathering data")
          }
        }
      }
    }>Search User</Button>
  </FormControl>
  );
}