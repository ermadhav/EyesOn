// import React, { useEffect, useRef, useState } from "react";
// import axios from "axios";
// import { MapPin } from "lucide-react";

// function App() {
//   const [mode, setMode] = useState("dashboard");
//   const [locations, setLocations] = useState([]);
//   const uid = new URLSearchParams(window.location.search).get("uid");

//   useEffect(() => {
//     if (window.location.pathname === "/track") {
//       setMode("track");
//     }
//   }, []);

//   useEffect(() => {
//     if (mode === "track") {
//       navigator.geolocation.getCurrentPosition((position) => {
//         axios.post("http://localhost:5000/api/location", {
//           uid: uid || "unknown-user",
//           lat: position.coords.latitude,
//           lng: position.coords.longitude,
//         });
//       });
//     }
//   }, [mode]);

//   useEffect(() => {
//     if (mode === "dashboard") {
//       axios.get("http://localhost:5000/api/locations").then((res) => {
//         setLocations(res.data);
//       });
//     }
//   }, [mode]);

//   if (mode === "track") {
//     return (
//       <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">
//         <div className="text-center">
//           <MapPin className="w-12 h-12 mx-auto text-green-400 animate-bounce" />
//           <h2 className="text-2xl font-semibold mt-2">Prank</h2>
//           <p className="text-green-400 mt-2">✅ Thank you!</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <h1 className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-2">
//         <MapPin className="w-6 h-6 text-blue-500" />
//         Tracked Users
//       </h1>
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//         {locations.map((loc) => (
//           <div
//             key={loc._id}
//             className="bg-white shadow-md rounded-2xl p-4 transition transform hover:scale-105"
//           >
//             <h2 className="text-xl font-semibold text-blue-600">{loc.uid}</h2>
//             <p className="text-gray-700 mt-2">
//               📍 Lat: {loc.latitude.toFixed(4)}, Lng: {loc.longitude.toFixed(4)}
//             </p>
//             <p className="text-gray-500 text-sm mt-1">
//               🕒 {new Date(loc.timestamp).toLocaleString()}
//             </p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default App;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapPin } from "lucide-react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "250px",
  borderRadius: "12px",
};

const defaultCenter = { lat: 20, lng: 0 };

function App() {
  const [mode, setMode] = useState("dashboard");
  const [locations, setLocations] = useState([]);
  const uid = new URLSearchParams(window.location.search).get("uid");

  // Google Maps API Loader
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
  }, [mode]); // ⛔️ warning: uid used inside but not declared in deps

  useEffect(() => {
    if (mode === "dashboard") {
      axios.get("http://localhost:5000/api/locations").then((res) => {
        setLocations(res.data);
      });
    }
  }, [mode]);

  if (mode === "track") {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
        <div className="text-center">
          <MapPin className="w-12 h-12 mx-auto text-green-400 animate-bounce" />
          <h2 className="text-2xl font-semibold mt-2">Location Shared</h2>
          <p className="text-green-400 mt-2">✅ Thank you!</p>
        </div>
      </div>
    );
  }

  const grouped = locations.reduce((acc, loc) => {
    if (!acc[loc.uid]) acc[loc.uid] = loc;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2 text-blue-400">
        <MapPin className="w-6 h-6" />
        Tracked Users (Google Maps)
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoaded &&
          Object.entries(grouped).map(([uid, loc]) => (
            <div
              key={uid}
              className="bg-gray-900 rounded-2xl shadow-md p-4 transition-all hover:shadow-lg"
            >
              <h2 className="text-lg font-semibold text-blue-300 mb-2">
                {uid}
              </h2>

              <GoogleMap
                mapContainerStyle={containerStyle}
                center={{ lat: loc.latitude, lng: loc.longitude }}
                zoom={13}
              >
                <Marker
                  position={{ lat: loc.latitude, lng: loc.longitude }}
                  title={`${uid}\nLat: ${loc.latitude}, Lng: ${loc.longitude}`}
                />
              </GoogleMap>

              <p className="text-gray-400 text-sm mt-2">
                📍 Lat: {loc.latitude.toFixed(4)}, Lng:{" "}
                {loc.longitude.toFixed(4)}
              </p>
              <p className="text-gray-500 text-xs mt-1">
                🕒 {new Date(loc.timestamp).toLocaleString()}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
}

export default App;
