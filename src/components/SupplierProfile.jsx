import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import debounce from "lodash.debounce";

// Store API Key & Libraries outside component to prevent unnecessary reloads
const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY; // Replace with actual API Key
const MAP_LIBRARIES = ["places"];

const SupplierProfile = () => {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    role: "",
    name: "",
    contact: "",
    location: { lat: 0, lng: 0 },
    address: "",
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Fetch user data with authentication
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found.");
        }

        const response = await axios.get("https://swiftora.vercel.app/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const user = response.data;
        setUserData({
          username: user.username || "",
          email: user.email || "",
          role: user.role || "",
          name: user.name || "",
          contact: user.contact || "",
          location: user.location || { lat: 0, lng: 0 },
          address: user.address || "",
        });

        setLoading(false);
      } catch (err) {
        setError("Failed to fetch user data.");
        console.error("Error fetching user data:", err);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Get Accurate Current Location Once
  useEffect(() => {
    if (!userData.location.lat && !userData.location.lng) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          try {
            // Fetch more accurate location using Google Geolocation API
            const geoResponse = await axios.post(
              `https://www.googleapis.com/geolocation/v1/geolocate?key=${API_KEY}`
            );
            const { lat: accurateLat, lng: accurateLng } = geoResponse.data.location;

            // Reverse geocode to get address
            const addressResponse = await axios.get(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${accurateLat},${accurateLng}&key=${API_KEY}`
            );

            const formattedAddress =
              addressResponse.data.results[0]?.formatted_address || "Unknown location";

            setUserData((prev) => ({
              ...prev,
              location: { lat: accurateLat, lng: accurateLng },
              address: formattedAddress,
            }));
          } catch (error) {
            console.error("Error fetching accurate location:", error);
            setUserData((prev) => ({
              ...prev,
              location: { lat, lng }, // Fallback to browser location
              address: "Location could not be determined",
            }));
          }
        },
        (err) => console.error("Error fetching location:", err),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }
  }, []);

  // Handle Input Changes (Including Address)
  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  // Handle Map Clicks to Update Address & Location
  const handleMapClick = async (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setUserData((prev) => ({ ...prev, location: { lat, lng } }));

    // Reverse Geocode Only When Necessary
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_KEY}`
      );

      if (response.data.results[0]) {
        setUserData((prev) => ({ ...prev, address: response.data.results[0].formatted_address }));
      }
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  // Debounced Function to Update Map from Input
  const handleAddressChange = useCallback(
    debounce(async (address) => {
      if (!address) return;
      try {
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`
        );
        if (response.data.results[0]) {
          const { lat, lng } = response.data.results[0].geometry.location;
          setUserData((prev) => ({ ...prev, location: { lat, lng } }));
        }
      } catch (error) {
        console.error("Error fetching location from address:", error);
      }
    }, 1000),
    []
  );

  // Update Location When Address Changes
  useEffect(() => {
    handleAddressChange(userData.address);
  }, [userData.address, handleAddressChange]);

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found.");
      }

      await axios.put("https://swiftora.vercel.app/api/users/update", userData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto mt-6">
      <h2 className="text-xl font-semibold text-[#5b2333]">Supplier Profile</h2>

      {loading ? (
        <p className="text-gray-600">Loading profile...</p>
      ) : (
        <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
          {/* Read-Only Fields */}
          {["username", "email", "role"].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 capitalize">{field}</label>
              <input
                type="text"
                name={field}
                value={userData[field]}
                readOnly
                className="w-full p-2 border rounded-md bg-gray-100 cursor-not-allowed"
              />
            </div>
          ))}

          {/* Editable Fields */}
          {["name", "contact"].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 capitalize">{field}</label>
              <input
                type="text"
                name={field}
                value={userData[field]}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:ring-[#5b2333] focus:border-[#5b2333]"
                required
              />
            </div>
          ))}

          {/* Location Field (Address Input) */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              name="address"
              value={userData.address}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:ring-[#5b2333] focus:border-[#5b2333]"
              placeholder="Enter your location"
            />
          </div>

          {/* Google Maps Location Picker */}
          <LoadScript googleMapsApiKey={API_KEY} libraries={MAP_LIBRARIES}>
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "300px" }}
              center={userData.location}
              zoom={12}
              onClick={handleMapClick}
            >
              <Marker position={userData.location} />
            </GoogleMap>
          </LoadScript>

          {/* Submit Button */}
          <button type="submit" className="w-full p-2 bg-[#5b2333] text-white rounded-md hover:bg-[#87475a]">
            Save Profile
          </button>
        </form>
      )}
    </div>
  );
};

export default SupplierProfile;
