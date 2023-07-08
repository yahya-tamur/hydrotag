import styles from '../styles/Map.module.css';
import React, { useState, useEffect } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, getDocs, addDoc, GeoPoint } from 'firebase/firestore';

import { app } from '../app';
const auth = getAuth(app);
const db = getFirestore(app);

export default function Map() {


  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });
  let [markerlist, setMarkerList] = useState([]);

  const fetchData = async () => {

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

    /*
    //for the 'poster' fields, since they're references to users, we
    //make more requests to firestore to get the data about the users they
    //refer to.
    for (const marker of arr) {
      marker.poster = await getDoc(marker.poster).then(res => res.data());
    }
    */

    setMarkerList(arr);

  };

  //this is how you have to fetch data from the database.
  useEffect(() => {


    fetchData();
  }, []);



  if (!isLoaded) return <div>Loading...</div>;

  let iconMarker = new google.maps.MarkerImage(
    "/water-fountain.jpg",
    null,
    null,
    null,
    new google.maps.Size(40, 40)
  );


  return (
    <div>

      <GoogleMap
        zoom={10}
        center={{ lat: 44, lng: -80 }}
        mapContainerClassName={styles.mapcontainer}
        onClick={async e => {

          if (!auth.currentUser?.uid) {
            alert("you must be logged in to place a marker!");
          } else {
            await addDoc(collection(db, "markers"), {
              location: new GeoPoint(e.latLng.lat(), e.latLng.lng()),
              poster: auth.currentUser.uid,
            });
            await fetchData();
            console.log(auth.currentUser?.uid);

          }


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
    </div >
  );
}
