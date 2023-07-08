import styles from '../styles/Map.module.css';
import React, { useState, useEffect } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, getDocs, addDoc, GeoPoint } from 'firebase/firestore';

import { app } from '../app';
const auth = getAuth(app);
const db = getFirestore(app);

function getLocation(callback) {
  let map, infoWindow;
 // infoWindow = new google.maps.InfoWindow();
  
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        let mylat = position.coords.latitude;
        let mylong = position.coords.longitude;
        let loc = { lat: mylat, lng: mylong };
        callback(loc); // Pass loc to the callback function
      },
      () => {
        console.log("Error: The Geolocation service failed");
        callback(null); // Pass null to indicate error
      }
    );
  } else {
    console.log("Error: The Geolocation service is not supported");
    callback(null); // Pass null to indicate error
  }
}

export default function Map() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });
  const [markerlist, setMarkerList] = useState([]);
  const [center, setCenter] = useState({ lat: 44, lng: -80 });
  const [currentPosition, setCurrentPosition] = useState(null);

  const fetchData = async () => {
    //get data from firestore.
    const snapshot = await getDocs(collection(db, 'markers'));
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
    setMarkerList(arr);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    getLocation((loc) => {
      if (loc !== null) {
        setCenter(loc);
        setCurrentPosition(loc);
      } else {
        console.log("Error: Unable to get location");
      }
    });
  }, []);

  if (!isLoaded) return <div>Loading...</div>;

  let iconMarker = new google.maps.MarkerImage(
    "/water-fountain.jpg",
    null,
    null,
    null,
    new google.maps.Size(40, 40)
  );

  let iconCurrentPosition = new google.maps.MarkerImage(
    "/logo.png",
    null,
    null,
    null,
    new google.maps.Size(40, 40)
  );

  return (
    <div>
      <GoogleMap
        zoom={15}
        center={center} // Use the center state as the map center
        mapContainerClassName={styles.mapcontainer}
        onClick={async (e) => {
          if (!auth.currentUser?.uid) {
            alert("You must be logged in to place a marker!");
          } else {
            await addDoc(collection(db, "markers"), {
              location: new GeoPoint(e.latLng.lat(), e.latLng.lng()),
              poster: auth.currentUser.uid,
            });
            await fetchData();
            console.log(auth.currentUser?.uid);
          }
        }}
      >
        {markerlist.map((marker, i) => (
          <Marker
            icon={iconMarker}
            position={marker}
            key={i}
            onClick={(e) => {
              alert(`Clicked ${marker.name}`);
            }}
          />
        ))}
        
        {currentPosition && (
          <Marker
            icon={iconCurrentPosition} 
            position={currentPosition}
          />
        )}
      </GoogleMap>
    </div>
  );
}
