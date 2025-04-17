import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

function App() {
  const videoRef = useRef(null);
  const [mode, setMode] = useState("dashboard"); // default
  const uid = new URLSearchParams(window.location.search).get("uid");

  // Mode switch based on route
  useEffect(() => {
    if (window.location.pathname === "/track") {
      setMode("track");
    }
  }, []);

  useEffect(() => {
    if (mode === "track") {
      // Geolocation
      navigator.geolocation.getCurrentPosition((position) => {
        axios.post("http://localhost:5000/api/location", {
          uid: uid || "unknown-user",
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });

      // Camera + Mic
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          console.error("Error accessing media:", err);
        });
    }
  }, [mode]);

  // Dashboard View
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    if (mode === "dashboard") {
      axios.get("http://localhost:5000/api/locations").then((res) => {
        setLocations(res.data);
      });
    }
  }, [mode]);

  if (mode === "track") {
    return (
      <div style={{ padding: "2rem" }}>
        <h2>📹 You are sharing your camera and mic</h2>
        <video ref={videoRef} autoPlay playsInline width="500" muted />
        <p>Your location has been shared successfully!</p>
      </div>
    );
  }

  // Dashboard view
  return (
    <div style={{ padding: "2rem" }}>
      <h1>📍 Tracked Users</h1>
      <ul>
        {locations.map((loc) => (
          <li key={loc._id}>
            <strong>{loc.uid}</strong> – Lat: {loc.latitude}, Lng: {loc.longitude} –{" "}
            {new Date(loc.timestamp).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
