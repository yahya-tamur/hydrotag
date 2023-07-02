import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { useMemo } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";


export default function Home() {

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  if (!isLoaded) return <div>Loading...</div>;
  return <div style={{height: `1000px`, width: `1000px`} } ><Map /></div> ;
}

function Map() {
 
  return (
    //<div className={styles.mapcontainer}> aaa</div>
    <GoogleMap zoom={10} center={{ lat: 44, lng: -80 }} mapContainerClassName={styles.mapcontainer}>
    
   </GoogleMap>
  );
 }
