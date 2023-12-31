import React, { useState, useEffect } from 'react';
import { GoogleMap, useLoadScript, Marker, useGoogleMap, DirectionsRenderer } from '@react-google-maps/api';
import { getAuth } from 'firebase/auth';
import {
  increment,
  updateDoc,
  getFirestore,
  collection,
  getDocs,
  addDoc,
  GeoPoint,
  doc,
  Timestamp,
} from 'firebase/firestore';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import ListItemText from '@mui/material/ListItemText';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import Paper from '@mui/material/Paper';
//add switch
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

import { app } from '../app';
const auth = getAuth(app);
const db = getFirestore(app);

//map otions setting

//san Francisco
const defaultmapCenter = {
  lat: 37.7749,
  lng: -122.4194,
};

export default function Map() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });
  const [markerlist, setMarkerList] = useState([]);
  const [friendlist, setfriendList] = useState([]);
  const [center, setCenter] = useState(defaultmapCenter);
  const [currentPosition, setCurrentPosition] = useState('');
  const [destination, setdestination] = useState('');
  const [directionresponse, setdirectionResponse] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(undefined);
  const [pin_fr, setpin_fr] = useState(false);
  const [review_fr, setreview_fr] = useState(false);
  const [cursor, setCursor] = useState('pointer');

  async function getroute() {
    if (currentPosition === '' || destination === '') {
      return;
    }
    const directionservice = new google.maps.DirectionsService();
    const results = await directionservice.route({
      origin: currentPosition,
      destination: destination,
      travelMode: google.maps.TravelMode.DRIVING,
    });
    setdirectionResponse(results);
    setshowroute(true);
  }

  function deleteroute() {
    setshowroute(false);
    setdirectionResponse(null);
  }

  const getMarkers = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'markers'));
      const arr = snapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
        lat: doc.data().location._lat,
        lng: doc.data().location._long,
        poster: doc.data().poster,
      }));
      setMarkerList(arr);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getMarkers();
  }, []);

  //use these if you ever need to detDocs(users) or getDocs(connections)!!!!
  let [users, setUsers] = useState([]);
  const [connections, setConnections] = useState([]);
  const getData = async () => {
    const user_snapshot = await getDocs(collection(db, 'users'));
    const user_arr = user_snapshot.docs.map(d => ({
      id: d.id,
      ...d.data(),
    }));
    setUsers(user_arr);

    const conn_snapshot = await getDocs(collection(db, 'connections'));
    const conn_arr = conn_snapshot.docs.map(d => ({
      id: d.id,
      ...d.data(),
    }));
    setConnections(conn_arr);
    setfriendList(conn_arr.filter(conn => conn.follower === auth.currentUser.uid).map(conn => conn.following));

    const review_snapshot = await getDocs(collection(db, 'reviews'));
    const review_arr = review_snapshot.docs.map(d => ({
      id: d.id,
      poster: user_arr.filter(u => u.id === d.data().poster)[0],
      marker: d.data().marker,
      text: d.data().text,
      timestamp: d.data().timestamp ? d.data().timestamp.toDate() : null,
    }));
    setReviews(review_arr);
  };

  useEffect(() => {
    getData();
  }, []);

  //Get current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setCenter({ lat: position.coords.latitude, lng: position.coords.longitude });
          setCurrentPosition({ lat: position.coords.latitude, lng: position.coords.longitude });
        },
        () => {
          console.log('Error: The Geolocation service failed');
        }
      );
    } else {
      console.log('Error: The Geolocation service is not supported');
    }
  }, []);

  const changeCursor = () => {
    setCursor(prevCursor => {
      if (prevCursor === 'pointer') {
        return 'crosshair';
      }
      return 'pointer';
    });
  };

  const [text, setText] = React.useState('');
  const [reviews, setReviews] = useState([]);
  const [adding, setAdding] = useState(false);
  const [showroute, setshowroute] = useState(false);

  if (!isLoaded) return <div>Loading...</div>;
  let iconMarker = new google.maps.MarkerImage('/water-pin.png', null, null, null, new google.maps.Size(50, 50));

  let iconSelectedMarker = new google.maps.MarkerImage(
    '/selected-pin.png',
    null,
    null,
    null,
    new google.maps.Size(75, 75)
  );

  let iconCurrentPosition = new google.maps.MarkerImage(
    '/current-pin.png',
    null,
    null,
    null,
    new google.maps.Size(120, 90)
  );
  const formatTimestamp = timestamp => {
    if (timestamp instanceof Date) {
      const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      };
      return new Intl.DateTimeFormat('en-US', options).format(timestamp);
    } else if (timestamp && timestamp.seconds) {
      const dateObject = new Date(timestamp.seconds * 1000);
      const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      };
      return new Intl.DateTimeFormat('en-US', options).format(dateObject);
    } else {
      // Handle the case when timestamp is null or invalid
      return 'Invalid Date';
    }
  };
  return (
    <div style={{ cursor: cursor }}>
      <div
        style={{
          display: 'flex',
          cursor: 'default',
        }}
      >
        <Paper
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 10,
            margin: '20px',
            height: 'calc(100vh - 134px)',
            marginLeft: '0px',
            paddingTop: '20px',
            marginTop: '0px',
            padding: '20px',
          }}
        >
          <ToggleButton
            value="Add Marker"
            color="primary"
            sx={{ width: '300px' }}
            selected={adding}
            onChange={() => {
              setAdding(!adding);
              changeCursor();
            }}
          >
            <Typography>Add Marker</Typography>
          </ToggleButton>
          <FormGroup sx={{ mb: '20px' }}>
            <FormControlLabel
              control={<Switch checked={pin_fr} onChange={e => setpin_fr(e.target.checked)} />}
              label="Markers from Following"
            />
            <FormControlLabel
              control={<Switch checked={review_fr} onChange={e => setreview_fr(e.target.checked)} />}
              label="Reviews from Following"
            />
          </FormGroup>
          {showroute ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Button
                variant="contained"
                color="error"
                onClick={() => {
                  deleteroute();
                }}
              >
                <Typography>Delete Route</Typography>
              </Button>
            </div>
          ) : null}

          {selectedMarker ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Button
                variant="contained"
                color="success"
                onClick={() => {
                  getroute();
                }}
              >
                <Typography>Find Route</Typography>
              </Button>
              <Typography variant="h6" component="div" sx={{ width: '250px', marginTop: '20px' }}>
                Marker by{' '}
                {users.find(user => user.id === markerlist.find(m => m.id === selectedMarker)?.poster)?.name ??
                  'no name'}
              </Typography>
              <TextField
                variant="standard"
                sx={{ mt: '10px' }}
                value={text}
                onChange={e => {
                  setText(e.target.value);
                }}
                placeholder="write a review..."
                InputProps={{
                  endAdornment: (
                    <Button
                      onClick={async () => {
                        if (selectedMarker == undefined) {
                          alert('no marker selected!');
                          return;
                        }
                        try {
                          await addDoc(collection(db, 'reviews'), {
                            marker: selectedMarker,
                            poster: auth.currentUser.uid,
                            text: text,
                            timestamp: Timestamp.now(), // added server time stamp
                          });
                          const u = users.find(user => user.id === auth.currentUser.uid);
                          updateDoc(doc(db, 'users', auth.currentUser.uid), {
                            reviews: increment(1),
                            lastActive: Timestamp.now(),
                            isstreak: false,
                            streak: u.isstreak ? u.streak + 1 : u.streak,
                          });
                          setText('');
                          getData();
                        } catch (e) {
                          console.log(e);
                        }
                      }}
                    >
                      {' '}
                      submit{' '}
                    </Button>
                  ),
                }}
              />

              <Typography variant="h6" component="div" sx={{ flexGrow: 1, marginTop: '20px' }}>
                Reviews:
              </Typography>
              {(!review_fr
                ? reviews
                : reviews.filter(r => friendlist.includes(r.poster.id) || r.poster.id === auth.currentUser.uid)
              ).filter(r => r.marker === selectedMarker).length == 0 && (
                <p style={{ marginLeft: '10px' }}>No reviews</p>
              )}
              <List
                sx={{
                  height: showroute ? 'calc(100vh - 536px)' : 'calc(100vh - 500px)',
                  width: '100%',
                  overflow: 'auto',
                }}
              >
                {(!review_fr
                  ? reviews
                  : reviews.filter(r => friendlist.includes(r.poster.id) || r.poster.id === auth.currentUser.uid)
                )
                  .filter(r => r.marker === selectedMarker)
                  .sort((a, b) => b.timestamp - a.timestamp)

                  .map(review => (
                    <ListItemText
                      key={review.id}
                      primary={review.poster.name ?? 'no name'}
                      primaryTypographyProps={{ fontSize: 'small' }}
                      secondary={`${review.text} (${formatTimestamp(review.timestamp)})`}
                      secondaryTypographyProps={{ fontSize: 'medium' }}
                      sx={{
                        bgcolor: 'background.paper',
                        boxShadow: 1,
                        borderRadius: 1,
                        p: 1,
                        minWidth: 250,
                        marginRight: '10px',
                      }}
                    />
                  ))}
              </List>
            </div>
          ) : (
            <div />
          )}
        </Paper>

        <GoogleMap
          zoom={15}
          center={center}
          mapContainerStyle={{
            width: 'calc(100vw - 600pt)',
            height: 'calc(100vh - 100pt)',
            padding: '1000pxm',
            fontWeight: 'bold',
            flex: 40,
            marginRight: '-240px',
            overflow: 'visible',
          }}
          options={{
            streetViewControl: false,
            disableDefaultUI: true,
            clickableIcons: false,
            draggableCursor: cursor,
            minZoom: 5,
            maxZoom: 16,
          }}
          onClick={async e => {
            if (!adding) {
              setSelectedMarker(undefined);
              setText('');
            } else {
              try {
                const ad = await addDoc(collection(db, 'markers'), {
                  location: new GeoPoint(e.latLng.lat(), e.latLng.lng()),
                  poster: auth.currentUser.uid,
                });
                const u = users.find(user => user.id === auth.currentUser.uid);
                updateDoc(doc(db, 'users', auth.currentUser.uid), {
                  markers: increment(1),
                  lastActive: Timestamp.now(),
                  isstreak: false,
                  streak: u.isstreak ? u.streak + 1 : u.streak,
                });
                await getMarkers();
                setAdding(false);
                changeCursor();
                setSelectedMarker(ad.id);
              } catch (e) {
                console.log(e);
              }
            }
          }}
        >
          {directionresponse && (
            <DirectionsRenderer directions={directionresponse} options={{ suppressMarkers: true }} />
          )}
          <PanningComponent targetLocation={center} />

          {(!pin_fr
            ? markerlist
            : markerlist.filter(marker => friendlist.includes(marker.poster) || marker.poster == auth.currentUser.uid)
          ).map((marker, i) => (
            <Marker
              icon={marker.id == selectedMarker ? iconSelectedMarker : iconMarker}
              position={marker}
              key={i}
              onClick={e => {
                if (selectedMarker !== marker.id) {
                  setText('');
                  setSelectedMarker(marker.id);
                  setdestination({ lat: marker.lat, lng: marker.lng });
                }
              }}
            />
          ))}
          {currentPosition && <Marker icon={iconCurrentPosition} position={currentPosition} />}
        </GoogleMap>
      </div>
    </div>
  );
}

// custom button move back to center(bug： showing multi-button when save the file. maybe fixed need more test)
function PanningComponent({ targetLocation }) {
  const map = useGoogleMap();
  const centerControlDivRef = React.useRef(null);

  React.useEffect(() => {
    if (map && targetLocation) {
      const centerControlDiv = document.createElement('div');
      const centerControlButton = document.createElement('button');

      // Set CSS for the control.
      centerControlButton.style.backgroundColor = '#fff';
      centerControlButton.style.border = '2px solid #fff';
      centerControlButton.style.borderRadius = '3px';
      centerControlButton.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
      centerControlButton.style.color = 'rgb(25,25,25)';
      centerControlButton.style.cursor = 'pointer';
      centerControlButton.style.fontFamily = 'Roboto,Arial,sans-serif';
      centerControlButton.style.fontSize = '16px';
      centerControlButton.style.lineHeight = '38px';
      centerControlButton.style.margin = '8px 0 22px';
      centerControlButton.style.padding = '0 5px';
      centerControlButton.style.textAlign = 'center';
      centerControlButton.textContent = 'Center Map';
      centerControlButton.title = 'Click to recenter the map';
      centerControlButton.type = 'button';

      centerControlButton.addEventListener('click', () => {
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
