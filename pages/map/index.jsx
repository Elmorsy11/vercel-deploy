import React, { useEffect, useState } from "react";
import { getDatabase, onValue, ref } from "firebase/database";
import configUrls from "config/config";
import dynamic from "next/dynamic";
import { initializeApp } from "firebase/app";
import axios from "axios";
import Markers from "components/dashboard/Markers";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  {
    ssr: false,
  }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  {
    ssr: false,
  }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  {
    ssr: false,
  }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});
let icon;
if (typeof window !== "undefined") {
  const L = require("leaflet");
  icon = L.divIcon({
    className: "my-custom-marker",
    html: `<div class="customMarker" style='width: 30px; background-color: red; height: 50px;'>
    <div>`,
  });
}
// const { getDatabase, onValue, ref} = dynamic(() => import("firebase/database").then((mod) => mod), {
//   ssr: false
// });
const firebaseConfig = {
  databaseURL: configUrls.firebase_config.databaseURL,
};

const Map = () => {
  const position = [25.278229, 48.488376];
  return (
    <div className="p-2" style={{ width: "100%", height: "100vh" }}>
      <MapContainer
        style={{ minHeight: "100%" }}
        center={position}
        zoom={6}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution="Google Maps"
          url="https://www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}"
        />
        <Markers />
      </MapContainer>{" "}
      :''
    </div>
  );
};

export default Map;
