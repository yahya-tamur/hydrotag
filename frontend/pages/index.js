import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { useState, useEffect } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";


export default function Home() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  if (!isLoaded) return <div>Loading...</div>;
  return <div style={{height: `100%`, width: `100%`} } ><Map /></div> ;
}

function Map() {
 
  let [markerlist, setMarkerList] = useState([]);

  useEffect(() => {
    const dataFetch = async () => {
      const data = await ( fetch (
          "http://localhost:3001/markers",
          {mode: "cors"}
        ));
      setMarkerList(await data.json());
    };
    dataFetch();
  }, []);


  let iconMarker = new window.google.maps.MarkerImage(
    "https://cdn-tp3.mozu.com/24645-37138/cms/37138/files/53fc49fe-ee2f-485d-bd4e-1412c4528451?quality=60&_mzcb=_1677685580029",
    null, /* size is determined at runtime */
    null, /* origin is 0,0 */
    null, /* anchor is bottom center of the scaled image */
    new window.google.maps.Size(32, 32)
);

  return (
    <GoogleMap
      zoom={10}
      center={{ lat: 44, lng: -80 }}
      mapContainerClassName={styles.mapcontainer}
      onClick={e => {
        console.log( `clicked:${e.latLng}`);
        const ml = [...markerlist]
        console.log(e);
        ml.push({
          id: "placeholder",
          name: "new water fountain",
          lat: e.latLng.lat(),
          lng: e.latLng.lng(),
          poster: {username:"test1"}
        })
        console.log(ml);
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
