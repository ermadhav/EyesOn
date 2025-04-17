// import React, { useEffect, useRef, useState } from "react";
// import axios from "axios";

// function App() {
//   const videoRef = useRef(null);
//   const [mode, setMode] = useState("dashboard"); // default
//   const uid = new URLSearchParams(window.location.search).get("uid");

//   // Mode switch based on route
//   useEffect(() => {
//     if (window.location.pathname === "/track") {
//       setMode("track");
//     }
//   }, []);

//   useEffect(() => {
//     if (mode === "track") {
//       // Geolocation
//       navigator.geolocation.getCurrentPosition((position) => {
//         axios.post("http://localhost:5000/api/location", {
//           uid: uid || "unknown-user",
//           lat: position.coords.latitude,
//           lng: position.coords.longitude,
//         });
//       });

//       // Camera + Mic
//       navigator.mediaDevices
//         .getUserMedia({ video: true, audio: true })
//         .then((stream) => {
//           if (videoRef.current) {
//             videoRef.current.srcObject = stream;
//           }
//         })
//         .catch((err) => {
//           console.error("Error accessing media:", err);
//         });
//     }
//   }, [mode]);

//   // Dashboard View
//   const [locations, setLocations] = useState([]);

//   useEffect(() => {
//     if (mode === "dashboard") {
//       axios.get("http://localhost:5000/api/locations").then((res) => {
//         setLocations(res.data);
//       });
//     }
//   }, [mode]);

//   if (mode === "track") {
//     return (
//       <div style={{ padding: "2rem" }}>
//         <h2>📹 You are sharing your camera and mic</h2>
//         <video ref={videoRef} autoPlay playsInline width="500" muted />
//         <p>Your location has been shared successfully!</p>
//       </div>
//     );
//   }

//   // Dashboard view
//   return (
//     <div style={{ padding: "2rem" }}>
//       <h1>📍 Tracked Users</h1>
//       <ul>
//         {locations.map((loc) => (
//           <li key={loc._id}>
//             <strong>{loc.uid}</strong> – Lat: {loc.latitude}, Lng: {loc.longitude} –{" "}
//             {new Date(loc.timestamp).toLocaleString()}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default App;


import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Video, MapPin } from "lucide-react";

function App() {
  const videoRef = useRef(null);
  const [mode, setMode] = useState("dashboard");
  const [locations, setLocations] = useState([]);
  const uid = new URLSearchParams(window.location.search).get("uid");

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

  useEffect(() => {
    if (mode === "dashboard") {
      axios.get("http://localhost:5000/api/locations").then((res) => {
        setLocations(res.data);
      });
    }
  }, [mode]);

  if (mode === "track") {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">
        <div className="text-center">
          <Video className="w-12 h-12 mx-auto animate-pulse" />
          <h2 className="text-2xl font-semibold mt-2">You are sharing your camera and mic</h2>
        </div>
        {/* <video
          ref={videoRef}
          autoPlay
          playsInline
          width="600"
          muted
          className="rounded-lg mt-6 shadow-lg"
        /> */}
        <p className="mt-4 text-green-400 font-medium">✅ Best Wishes to you!</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <MapPin className="w-6 h-6 text-blue-500" />
        Tracked Users
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {locations.map((loc) => (
          <div
            key={loc._id}
            className="bg-white shadow-md rounded-2xl p-4 transition transform hover:scale-105"
          >
            <h2 className="text-xl font-semibold text-blue-600">{loc.uid}</h2>
            <p className="text-gray-700 mt-2">
              📍 Lat: {loc.latitude.toFixed(4)}, Lng: {loc.longitude.toFixed(4)}
            </p>
            <p className="text-gray-500 text-sm mt-1">
              🕒 {new Date(loc.timestamp).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
