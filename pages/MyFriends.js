import React from 'react';
import { getAuth } from "firebase/auth";
import Sidebar from './Sidebar';

import {app} from '../app';
const auth = getAuth(app);

export default function Home() {
  return (
    <div>
      <Sidebar />
      <div className="banner">
        <div className="banner-content">
          <h2>{auth.currentUser?.uid ?? "Guest"}</h2>
          <button type="button" onClick={async () => {
            await auth.signOut();
            console.log("signed out.");
            console.log(auth.currentUser?.uid)
            location.reload();
          }}> logout </button>
          <h1>Hydrotag</h1>
        </div>
      </div>
    </div>
  );
}
