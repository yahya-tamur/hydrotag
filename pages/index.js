import React, { useState } from "react";
import { getAuth } from "firebase/auth";
import { useRouter } from 'next/router';
import Map from '../components/Map';

import {app} from '../app';
const auth = getAuth(app);

export default function Home() {

  const router = useRouter();

  const [text, setText] = React.useState("");
  const [reviews, setReviews] = useState([]);//displays the the reviews as a list
  const change = (event) => {
    setText(event.target.value);
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    setReviews([...reviews, text]);
    setText('');
  };

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
             }}> logout </button>
            <button type="button" onClick={() => { router.push("login") }}> click here to login </button>
            <p>Hydrotag</p>
          </div>
        </div>
      </h1>
      <Map />

      <form onSubmit={handleSubmit}>

      <p></p>
      <p></p>
      <textarea value={text} onChange={change} placeholder="enter text here..."/>
      <br></br>
      <button type="submit">Submit Review</button>
      </form>
      <p></p>
      <b>Reviews:</b>
      {reviews.map((review, index) => (
      <div key={index} className="review">
      {review}
      </div>
      ))}
    </div>
  );
}
