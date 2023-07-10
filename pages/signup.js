/*import {useState} from 'react';
import {useRouter} from 'next/router'
import { getAuth, updateProfile, createUserWithEmailAndPassword} from "firebase/auth";
import Image from 'next/image';
import {doc, setDoc} from 'firebase/firestore'

import {app} from '../app';
import { getFirestore } from 'firebase/firestore';
const auth = getAuth(app);
const db = getFirestore(app);

export default function signupForm() {
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
    const submit = (event) => {
        event.preventDefault();
        if (!validate()) {
            return false
        }
        register(auth, email, password);
    }

    function validate(event) {
        if (password != check) {
            console.log("Passwords do not match");
            return false
        }
        return true
    }

    const register = async (event) => {
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
    <form onSubmit={submit}>
      <Image 
        src="/logo.png"
        width={500}
        height={500}
        alt="logo"
      />
      <div>
        <label for="email">Email:</label>
        <input type="text" value={email} onChange= {handleEmailChange} />
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" value={password} onChange= {handlePassChange} />
      </div>
      <div>
        <label for="confirmpassword">Confirm your Password:</label>
        <input type="password" value={check} onChange= {handleCheck}></input>
      </div>
      <button type="submit" value='up' id= "button">
        Submit
      </button>
    </form>
    )
}
*/