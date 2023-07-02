import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { useState } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";


export default function Home() {

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  if (!isLoaded) return <div>Loading...</div>;
  return <div style={{height: `1000px`, width: `1000px`} } ><Map /></div> ;
}

function Map() {
 
  let [markerlist, setMarkerList] = useState([{lat: 44, lng: -80}]);
  let iconMarker = new window.google.maps.MarkerImage(
    "https://cdn-tp3.mozu.com/24645-37138/cms/37138/files/53fc49fe-ee2f-485d-bd4e-1412c4528451?quality=60&_mzcb=_1677685580029",
    null, /* size is determined at runtime */
    null, /* origin is 0,0 */
    null, /* anchor is bottom center of the scaled image */
    new window.google.maps.Size(32, 32)
);

  return (
    //<div className={styles.mapcontainer}> aaa</div>
    <GoogleMap
      zoom={10}
      center={{ lat: 44, lng: -80 }}
      mapContainerClassName={styles.mapcontainer}
      onClick={e => {
        console.log( `clicked:${e.latLng}`);
        const ml = [...markerlist]
        ml.push(e.latLng)
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
              console.log(`clicked marker at ${e.latLng}`)
            }}
          />
        )
  } 
     
   </GoogleMap>
  );
 }
