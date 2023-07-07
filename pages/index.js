import mapstyles from '../styles/Map.module.css';
import { useState, useEffect } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter} from 'next/router';

import firebaseConfig from '../firebaseConfig';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const user = auth.currentUser

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
    const uid = user.uid;
    console.log(user.uid + 'is logged in')
    // ...
  } else {
    console.log('Guest user')
    const uid = "Guest"
    // User is signed out
    // ...
  }
});

export default function Home() {

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div style={{height: `100%`, width: `100%`} } >
      <Map />
    </div>
  );
}

function Map() {
  const router = useRouter();

  //learn about react, useState.
  let [markerlist, setMarkerList] = useState([]);

  /*
  //this is how you have to fetch data from the backend.
  useEffect(() => {
    const dataFetch = async () => {
      const request = await fetch (
          "http://localhost:3001/markers",
          {mode: "cors"}
        );
      setMarkerList(await request.json());
    };
    dataFetch();
  }, []);
*/

  let iconMarker = new window.google.maps.MarkerImage(
    "/water-fountain.jpg",
    null,
    null,
    null, 
    new window.google.maps.Size(40, 40)
);
  var userBanner = 'Guest'
  if (user?.uid != null) {
    userBanner = user.uid
  }

  return (
    <div>
      <h1>
        <div className="banner">
          <div className="banner-content">
            <h2>{userBanner}</h2>
            <button type="button" onClick={() => {router.push("posts/login")}}> click here to login </button>
            <p>Hydrotag</p>
          </div>
        </div>
      </h1>
      <GoogleMap
      zoom={10}
      center={{ lat: 44, lng: -80 }}
      mapContainerClassName={mapstyles.mapcontainer}
      onClick={e => {

        // adds a new marker to markerlist. you have to clone the array,
        // add something to the cloned array, then call setMarkerList in 
        // order for the page to update properly.
        const ml = [...markerlist]
        ml.push({
          id: "placeholder",
          name: "new water fountain",
          lat: e.latLng.lat(),
          lng: e.latLng.lng(),
          poster: {username:"test1"}
        })
        setMarkerList(ml);

        }
      }>

      {
        markerlist.map((marker, i) =>
          <Marker
            icon={iconMarker}
            position={marker}
            key={i}
            onClick={e => {
              alert(`clicked ${marker.name}`);
            }}
          />
        )
      } 
      </GoogleMap>
    </div>
  );
 }
