import mapstyles from '../styles/Map.module.css';
import { useState, useEffect } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";


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
 
  //learn about react, useState.
  let [markerlist, setMarkerList] = useState([]);

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


  let iconMarker = new window.google.maps.MarkerImage(
    "/water-fountain.jpg",
    null,
    null,
    null, 
    new window.google.maps.Size(40, 40)
);

  return (
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
  );
 }
