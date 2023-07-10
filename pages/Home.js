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
          </div>
        </div>
      </h1>
      <Map />
    </div>
  );
}