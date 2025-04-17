import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

function App() {
  const [locations, setLocations] = useState([]);
  const videoRef = useRef(null);
  const audioRef = useRef(null);

  const uid = new URLSearchParams(window.location.search).get("uid") || "anonymous";
  const isTrackingPage = window.location.pathname === "/track";

  // 1. Geolocation Tracking
  useEffect(() => {
    if (isTrackingPage && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        axios.post("http://localhost:5000/api/location", {
          uid,
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    } else {
      axios.get("http://localhost:5000/api/locations").then((res) => setLocations(res.data));
    }
  }, []);

  // 2. Access camera & mic with permission
  useEffect(() => {
    if (isTrackingPage) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((stream) => {
          if (videoRef.current) videoRef.current.srcObject = stream;
          if (audioRef.current) audioRef.current.srcObject = stream;
        })
        .catch((err) => {
          console.error("Media access denied:", err);
        });
    }
  }, []);

  // 3. UI Rendering
  if (isTrackingPage) {
    return (
      <div style={{ padding: 20 }}>
        <h2>📍 Thanks! You're now sharing your location and camera (with permission).</h2>
        <video ref={videoRef} autoPlay playsInline muted width="400" />
        <audio ref={audioRef} autoPlay controls hidden />
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>📍 Tracked Users</h1>
      <ul>
        {locations.map((loc) => (
          <li key={loc._id}>
            <strong>{loc.uid}</strong> — Lat: {loc.latitude}, Lng: {loc.longitude} —{" "}
            {new Date(loc.timestamp).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
