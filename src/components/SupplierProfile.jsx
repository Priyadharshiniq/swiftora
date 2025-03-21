import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { GoogleMap, useJsApiLoader, MarkerF } from "@react-google-maps/api";
import debounce from "lodash.debounce";

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const MAP_LIBRARIES = ["places"];

const SupplierProfile = () => {
  const [userData, setUserData] = useState({
    userId: "",
    supplierId: "",
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

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: API_KEY,
    libraries: MAP_LIBRARIES,
  });

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found.");

      // Step 1: Fetch basic user profile (userId, username, email, role)
      const userProfileResponse = await axios.get(
        "https://swiftora.vercel.app/api/users/profile",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const user = userProfileResponse.data;
      
      // Initialize userData with user profile data
      let profileData = {
        userId: user.userId,
        username: user.username || "",
        email: user.email || "",
        role: user.role || "",
        supplierId: "",
        name: "",
        contact: "",
        location: { lat: 0, lng: 0 },
        address: "",
      };

      // Step 2: Fetch supplier profile (supplierId, name, contact)
      try {
        const supplierProfileResponse = await axios.get(
          "https://swiftora.vercel.app/api/suppliers/profile",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        const supplier = supplierProfileResponse.data;
        
        // Update profile data with supplier information
        profileData.supplierId = supplier.supplierId;
        profileData.name = supplier.name || "";
        profileData.contact = supplier.contact || "";
      } catch (supplierError) {
        console.error("Error fetching supplier profile:", supplierError);
      }

      // Step 3: Fetch location data using userId
      try {
        const locationResponse = await axios.get(
          `https://swiftora.vercel.app/api/users/location/${user.userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (locationResponse.data.success && locationResponse.data.location) {
          profileData.location = locationResponse.data.location;
          profileData.address = locationResponse.data.location.address || "";
        }
      } catch (locationError) {
        console.warn("⚠ No stored location found, defaulting to current location.");
        // Will fetch current location in useEffect
      }

      setUserData(profileData);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch user data. Please try again later.");
      console.error("Error fetching user data:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Fetch current location if no location is set
  useEffect(() => {
    if ((!userData.location.lat && !userData.location.lng) || 
        (userData.location.lat === 0 && userData.location.lng === 0)) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          try {
            const addressResponse = await axios.get(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_KEY}`
            );

            const formattedAddress =
              addressResponse.data.results[0]?.formatted_address || "Unknown location";

            setUserData((prev) => ({
              ...prev,
              location: { lat, lng },
              address: formattedAddress,
            }));
          } catch (error) {
            console.error("Error fetching accurate location:", error);
            setUserData((prev) => ({
              ...prev,
              location: { lat, lng },
            }));
          }
        },
        (err) => console.error("Error fetching location:", err),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }
  }, [userData.location]);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleMapClick = async (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setUserData((prev) => ({ ...prev, location: { lat, lng } }));

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

  useEffect(() => {
    handleAddressChange(userData.address);
  }, [userData.address, handleAddressChange]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found.");

      // Only update supplier info if supplierId exists
      if (userData.supplierId) {
        // Update supplier name and contact
        await axios.put(
          `https://swiftora.vercel.app/api/suppliers/${userData.supplierId}`,
          { name: userData.name, contact: userData.contact },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        throw new Error("Supplier ID not found. Cannot update supplier information.");
      }

      // Update user location
      await axios.put(
        "https://swiftora.vercel.app/api/users/update-location",
        { 
          userId: userData.userId, 
          location: userData.location, 
          address: userData.address 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // After successful update, refresh the data to show updated values
      fetchUserProfile();
      
      setMessage("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile. " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto mt-6">
      <h2 className="text-xl font-semibold text-[#5b2333]">Supplier Profile</h2>

      {loading ? (
        <p className="text-gray-600">Loading profile...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
          {message && <div className="p-2 bg-green-100 text-green-700 rounded">{message}</div>}
          
          {/* Read-only fields from user table */}
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

          {/* Editable fields from supplier table */}
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

          {/* Location field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              name="address"
              value={userData.address}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              placeholder="Enter your location"
            />
          </div>

          {/* Google Map */}
          {isLoaded && (
            <GoogleMap 
              mapContainerStyle={{ width: "100%", height: "300px" }} 
              center={userData.location.lat ? userData.location : { lat: 28.6139, lng: 77.2090 }} 
              zoom={12} 
              onClick={handleMapClick}
            >
              <MarkerF position={userData.location} />
            </GoogleMap>
          )}

          {/* Form submission button */}
          <button 
            type="submit" 
            className="w-full p-2 bg-[#5b2333] text-white rounded-md hover:bg-[#4a1c29]"
            disabled={!userData.supplierId}
          >
            Save Profile
          </button>
          
          {!userData.supplierId && (
            <p className="text-yellow-600 text-sm">
              Supplier profile not found. Please contact support.
            </p>
          )}
        </form>
      )}
    </div>
  );
};

export default SupplierProfile;