import React, { useState, useEffect, useMemo, useCallback } from "react";
import { GoogleMap, useLoadScript, Marker, useGoogleMap, DirectionsRenderer } from "@react-google-maps/api";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, getDocs, addDoc, GeoPoint, getDoc, doc, serverTimestamp } from 'firebase/firestore';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import ListItemText from '@mui/material/ListItemText';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import Paper from '@mui/material/Paper';

import { app } from '../app';
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
  const [currentPosition, setCurrentPosition] = useState('');
  const [destination, setdestination] = useState('');
  const [zoom, setzoom] = useState(11);
  const [directionresponse, setdirectionResponse] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(undefined);

 async function getroute(){
  if (currentPosition === '' || destination === ''){
    return
  }
    const directionservice = new google.maps.DirectionsService();
    const results = await directionservice.route({
      origin: currentPosition,
      destination: destination,
      travelMode: google.maps.TravelMode.DRIVING
    })
    setdirectionResponse(results);
    console.log(results);
    setshowroute(true);
 }

 function deleteroute(){
  setshowroute(false);
  //setdestination('');
  setdirectionResponse(null);
 }

  const getMarkers = async () => {
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
  useEffect(() => {
    getMarkers();
  }, []);


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
  //Get current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter({ lat: position.coords.latitude, lng: position.coords.longitude });
          setCurrentPosition({ lat: position.coords.latitude, lng: position.coords.longitude });
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

  const [reviews, setReviews] = useState([]);//displays the the reviews as a list
  const [adding, setAdding] = useState(false);
  const [showroute, setshowroute] = useState(false);

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
    <div style={{
      display: 'flex',
    }}>

      <Paper style={{
        flex: 10,
        margin: '20px',
        marginLeft: '0px',
        padding: '20px',
      }}>
        <ToggleButton
          value="Add Marker"
          color='primary'
          selected={adding}
          onChange={() => {
            setAdding(!adding);
          }}
        >
          <Typography>
            Add Marker
          </Typography>
        </ToggleButton>
        {showroute ? (
          
        <div style={{
          display: 'flex',
          flexDirection: 'column',
        }}>
          <Button
                variant="contained"
                color='error'
                onClick={() => {
                  deleteroute();
                }}
              >
                <Typography>
                Delete Route
                </Typography>
              </Button>
        </div>
      ) : null}


        {selectedMarker ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
          }}>
            
          <Button
          variant="contained"
          color='success'
          onClick={() => {
            getroute();
          }}
        >
          <Typography>
          Find Route
          </Typography>
         </Button>

            <Typography variant="h6" component="div" sx={{ flexGrow: 1, marginTop: '20px' }}>
              Reviews:
            </Typography>
            <List>
              {reviews.map(review => (
                <ListItemText key={review.id} primary={review.poster} secondary={review.text} />

              ))}
            </List>
            
            

            <TextField variant="standard" value={text} onChange={e => { setText(e.target.value) }} placeholder="write a review..." />
            <Button
              sx={{ alignSelf: 'flex-start', margin: '10px', marginLeft: '0px' }}
              variant='outlined'
              onClick={
                async () => {
                  if (selectedMarker == undefined) {
                    alert("no marker selected!");
                    return;
                  }
                  try {
                    await addDoc(collection(db, "reviews"), {
                      marker: selectedMarker,
                      poster: auth.currentUser.uid,
                      text: text
                    });
                    await getReviews(selectedMarker);
                    setText("");
                  } catch {
                    alert("error adding data!");
                  }
                }

              }>Submit</Button>
          </div>

        ) : (<div />)}
      </Paper>

      <GoogleMap
        zoom={zoom}
        center={center}
        mapContainerStyle={{
          width: 'calc(100vw - 350pt)',
          height: 'calc(100vh - 350pt)',
          padding: '1000pxm',
          fontWeight: 'bold',
          flex: 40,
          border: '4mm ridge rgba(211, 220, 50, .6)',
          overflow: 'visible',
        }}
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
                await getMarkers();
                setAdding(false);
              } catch {
                alert("error submitting data!");
              }
            }
          }
        }}
      >     
          {directionresponse && (
            <DirectionsRenderer 
            directions={directionresponse}
            options = {{suppressMarkers: true}} 
            />
          )}
        <PanningComponent targetLocation={center} />

      

        {markerlist.map((marker, i) => (
          <Marker
            icon={marker.id == selectedMarker ? iconSelectedMarker : iconMarker}
            position={marker}
            key={i}
            onClick={(e) => {
              setSelectedMarker(marker.id);
              getReviews(marker.id);
              setdestination({ lat: marker.lat, lng: marker.lng });
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

