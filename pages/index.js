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
