import mapstyles from '../styles/Map.module.css';
import { useState, useEffect } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, getDocs, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';

import firebaseConfig from '../firebaseConfig';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function Home() {

  const router = useRouter();

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div style={{ height: `100%`, width: `100%` }} >
      <h1>
        <div className="banner">
          <div className="banner-content">
            <h2>{auth.currentUser?.uid ?? "Guest"}</h2>
            <button type="button" onClick={() => { router.push("posts/login") }}> click here to login </button>
            <p>Hydrotag</p>
          </div>
        </div>
      </h1>
      <Map />
    </div>
  );
}

function Map() {

  const db = getFirestore(app);

  let [markerlist, setMarkerList] = useState([]);

  //this is how you have to fetch data from the database.
  useEffect(() => {
    const dataFetch = async () => {

      //get data from firestore.
      const snapshot = await getDocs(collection(db, 'markers'));

      //transforms the data we receive into a convenient form.
      let arr = [];
      snapshot.forEach((doc) => {
        console.log(doc.data());
        arr.push({
          id: doc.id,
          name: doc.data().name,
          lat: doc.data().location._lat,
          lng: doc.data().location._long,
          poster: doc.data().poster,
        });

      });

      //for the 'poster' fields, since they're references to users, we
      //make more requests to firestore to get the data about the users they
      //refer to.
      for (const marker of arr) {
        marker.poster = await getDoc(marker.poster).then(res => res.data());
      }

      setMarkerList(arr);

    };

    dataFetch();
  }, []);


  let iconMarker = new window.google.maps.MarkerImage(
    "/water-fountain.jpg",
    null,
    null,
    null,
    new window.google.maps.Size(40, 40)
  );

  return (
    <div>

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
            poster: { username: "test1" }
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
