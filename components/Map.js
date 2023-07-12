import styles from '../styles/Map.module.css';
import React, { useState, useEffect } from "react";
import { GoogleMap, useLoadScript, Marker, useGoogleMap } from "@react-google-maps/api";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, getDocs, addDoc, GeoPoint, getDoc, doc, serverTimestamp} from 'firebase/firestore';
import { app } from '../app';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
const auth = getAuth(app);
const db = getFirestore(app);

//map otions setting
const options = {
  streetViewControl: false,
  disableDefaultUI: true,
  clickableIcons: false,
  minZoom: 5, maxZoom: 16
}

//san Francisco
const defaultmapCenter = {
  lat: 37.7749,
  lng: -122.4194
}

export default function Map() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });
  const [markerlist, setMarkerList] = useState([]);
  const [center, setCenter] = useState(defaultmapCenter);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [zoom, setzoom] = useState(11);

  const [selectedMarker, setSelectedMarker] = useState(undefined);

  const fetchData = async () => {
    //get data from firestore.
    
    try {
      const snapshot = await getDocs(collection(db, 'markers'));
      let arr = [];
      snapshot.forEach((doc) => {
        arr.push({
          id: doc.id,
          name: doc.data().name,
          lat: doc.data().location._lat,
          lng: doc.data().location._long,
          poster: doc.data().poster,
        });
      });
      setMarkerList(arr)
    } catch {
      alert("error getting data!")
    };

  };

  const getReviews = async (sel_marker) => {

    try {
      const snapshot = await getDocs(collection(db, 'reviews'));
      let arr = [];
      snapshot.forEach(async (d) => {
        console.log(d.data());
        if (d.data().marker == sel_marker) {
          arr.push({
            id: d.id,
            poster: d.data().poster,
            marker: d.data().marker,
            text: d.data().text,
          });
        }
      });
      for (const el of arr) {
        const email = await getDoc(doc(db, "users", el.poster));
        el.poster = email.data().email;
      }

      console.log(arr);
      setReviews(arr);
    } catch {
      alert("error getting data!");
    }
  }
  useEffect(() => {
    fetchData();
  }, []);

  //Get current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          let mylat = position.coords.latitude;
          let mylong = position.coords.longitude;
          let loc = { lat: mylat, lng: mylong };
          setCenter(loc);
          setCurrentPosition(loc);
          setzoom(15)
        },
        () => {
          alert("Error: The Geolocation service failed");
        }
      );
    } else {
      alert("Error: The Geolocation service is not supported");
    }
  }, []);

  const [text, setText] = React.useState("");
  const [emailtext, setEmailText] = React.useState("");
  const [reviews, setReviews] = useState([]);//displays the the reviews as a list
  const [adding, setAdding] = useState(false);
  var fuid = ""

  if (!isLoaded) return <div>Loading...</div>;
  let iconMarker = new google.maps.MarkerImage(
    "/water-fountain.jpg",
    null,
    null,
    null,
    new google.maps.Size(40, 40)
  );

  let iconSelectedMarker = new google.maps.MarkerImage(
    "/water-fountain-selected.jpg",
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
      <FormControlLabel
        control={
          <Checkbox
            checked={adding}
            onChange={() => { setAdding(!adding); }}
            inputProps={{ 'aria-label': 'controlled' }}
          />
        }
        label="Add Marker"
      />
      <GoogleMap
        zoom={zoom}
        center={center}
        mapContainerClassName={styles.mapcontainer}
        options={options}
        onClick={async (e) => {
          if (!adding) {
            setSelectedMarker(undefined);
            getReviews(undefined);
          } else {
            if (!auth.currentUser?.uid) {
              alert("You must be logged in to place a marker!");
            } else {
              try {
                await addDoc(collection(db, "markers"), {
                  location: new GeoPoint(e.latLng.lat(), e.latLng.lng()),
                  poster: auth.currentUser.uid,
                });
                await fetchData();
                setAdding(false);

              } catch {
                alert("error submitting data!");
              }

            }
          }
        }}
      >
        <PanningComponent targetLocation={center} />
        {markerlist.map((marker, i) => (
          <Marker
            icon={marker.id == selectedMarker ? iconSelectedMarker : iconMarker}
            position={marker}
            key={i}
            onClick={(e) => {
              setSelectedMarker(marker.id);
              getReviews(marker.id);
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

      <FormControl>
        <FormLabel>Add Review</FormLabel>
        <TextField value={text} onChange={e => {setText(e.target.value)}} placeholder="enter text here..."></TextField>
        <Button onClick={
          async () => {
            if (selectedMarker == undefined) {
              alert("no marker selected!");
            } else {
              try {
                await addDoc(collection(db, "reviews"), {
                  marker: selectedMarker,
                  poster: auth.currentUser.uid,
                  text: text
                });
                await getReviews(selectedMarker);
              } catch {
                alert("error adding data!");
              }

            }
          }

        }>Submit Review</Button>
      </FormControl>
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

      <p />
      <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        Reviews:
      </Typography>
      <List>
      {reviews.map(review => (
        <ListItemText key={review.id} primary={review.poster} secondary={review.text} />

      ))}

      </List>

    </div>

  );
}

// custom button move back to center(bug： showing multi-button when save the file. maybe fixed need more test)
function PanningComponent({ targetLocation }) {
  const map = useGoogleMap();
  const centerControlDivRef = React.useRef(null);

  React.useEffect(() => {
    if (map && targetLocation) {
      const centerControlDiv = document.createElement("div");
      const centerControlButton = document.createElement("button");

      // Set CSS for the control.
      centerControlButton.style.backgroundColor = "#fff";
      centerControlButton.style.border = "2px solid #fff";
      centerControlButton.style.borderRadius = "3px";
      centerControlButton.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
      centerControlButton.style.color = "rgb(25,25,25)";
      centerControlButton.style.cursor = "pointer";
      centerControlButton.style.fontFamily = "Roboto,Arial,sans-serif";
      centerControlButton.style.fontSize = "16px";
      centerControlButton.style.lineHeight = "38px";
      centerControlButton.style.margin = "8px 0 22px";
      centerControlButton.style.padding = "0 5px";
      centerControlButton.style.textAlign = "center";
      centerControlButton.textContent = "Center Map";
      centerControlButton.title = "Click to recenter the map";
      centerControlButton.type = "button";

      centerControlButton.addEventListener("click", () => {
        map.panTo(targetLocation);
      });

      centerControlDiv.appendChild(centerControlButton);
      if (centerControlDivRef.current) {
        centerControlDivRef.current.removeChild(centerControlDivRef.current.firstChild);
      }
      centerControlDivRef.current = centerControlDiv;

      map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(centerControlDiv);
    }
  }, [map, targetLocation]);
  return null;
}

