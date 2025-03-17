import React from "react";
import { Routes, Route } from "react-router-dom";
import Registration from "./pages/Registration";
import CurrentInventory from "./components/CurrentInventory";
import SupermarketsSupplied from "./components/SupermarketsSupplied";
import MyOrders from "./components/MyOrders";
import InventoryList from "./components/InventoryList";
import SupplierDashboard from "./pages/SupplierDashboard";
import SupermarketDashboard from "./pages/SupermarketDashboard";
import Login from "./pages/Login";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Registration />} />
      <Route path="/supplier-dashboard" element={<SupplierDashboard />} />
      <Route path="/supermarket-dashboard" element={<SupermarketDashboard />} />
    </Routes>
  );
}

export default App;
