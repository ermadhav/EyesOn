import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapPin } from "lucide-react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import "./App.css"; 

const containerStyle = {
  width: "100%",
  height: "160px", 
  borderRadius: "12px",
};

function App() {
  const [mode, setMode] = useState("dashboard");
  const [locations, setLocations] = useState([]);
  const uid = new URLSearchParams(window.location.search).get("uid");

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    if (window.location.pathname === "/track") {
      setMode("track");
    }
  }, []);

  useEffect(() => {
    if (mode === "track") {
      navigator.geolocation.getCurrentPosition((position) => {
        axios.post("http://localhost:5000/api/location", {
          uid: uid || "unknown-user",
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    }
  }, [mode]);

  useEffect(() => {
    if (mode === "dashboard") {
      axios.get("http://localhost:5000/api/locations").then((res) => {
        setLocations(res.data);
      });
    }
  }, [mode]);

  if (mode === "track") {
    return (
      <div className="page track">
        <div className="track-content">
          <MapPin className="icon bounce" />
          <h2>Location Shared</h2>
          <p>✅ Thank you!</p>
        </div>
      </div>
    );
  }

  const grouped = locations.reduce((acc, loc) => {
    if (!acc[loc.uid]) acc[loc.uid] = loc;
    return acc;
  }, {});

  return (
    <div className="page dashboard">
      <h1 className="heading">
        <MapPin className="icon" />
        Tracked Users
      </h1>

      <div className="cards">
        {isLoaded &&
          Object.entries(grouped).map(([uid, loc]) => (
            <div className="card" key={uid}>
              <h2>{uid}</h2>
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={{ lat: loc.latitude, lng: loc.longitude }}
                zoom={13}
              >
                <Marker position={{ lat: loc.latitude, lng: loc.longitude }} />
              </GoogleMap>
              <p>
                📍 {loc.latitude.toFixed(4)}, {loc.longitude.toFixed(4)}
              </p>
              <small>
                🕒{" "}
                {new Date(loc.timestamp).toLocaleString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </small>
            </div>
          ))}
      </div>
    </div>
  );
}

export default App;
