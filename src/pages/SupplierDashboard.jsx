import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import SupermarketsSupplied from "../components/SupermarketsSupplied"; 
import { ShoppingCart, Box, Users, FileText, RefreshCcw, Printer } from "react-feather";

const SupplierDashboard = () => {
  const [showSupermarketDetails, setShowSupermarketDetails] = useState(false);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [showRevenueDetails, setShowRevenueDetails] = useState(false);

  // Sample Inventory Data
  const inventoryItems = [
    { id: 1, name: "Organic Apples", sku: "APL-001", stock: 500, lastUpdated: "2 hours ago", status: "In Stock" },
    { id: 2, name: "Fresh Milk", sku: "MLK-002", stock: 50, lastUpdated: "1 hour ago", status: "Low Stock" },
    { id: 3, name: "Whole Grain Bread", sku: "BRD-003", stock: 0, lastUpdated: "30 minutes ago", status: "Out of Stock" }
  ];

  return (
    <div className="flex min-h-screen bg-[#f7f4f3]">
      {/* Sidebar (Fixed Width) */}
      <div className="w-64 flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-semibold text-[#5b2333]">Supplier Dashboard</h1>

        {/* Top Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {/* Active Supermarkets */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-[#5b2333]" />
              <h2 className="text-lg font-semibold text-[#5b2333]">Active Supermarkets</h2>
            </div>
            <p className="text-3xl font-bold text-black mt-2">12</p>
            <p className="text-sm text-green-600">+2 this month</p>
            <button
              className="text-blue-600 text-sm mt-2"
              onClick={() => setShowSupermarketDetails(!showSupermarketDetails)}
            >
              {showSupermarketDetails ? "Hide Details ▲" : "Show Details ▼"}
            </button>
            {showSupermarketDetails && (
              <ul className="text-sm text-gray-600 mt-2 space-y-1">
                <li>8 Premium Partners</li>
                <li>4 Standard Partners</li>
                <li>2 Pending Applications</li>
              </ul>
            )}
          </div>

          {/* Total Orders */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="h-5 w-5 text-[#5b2333]" />
              <h2 className="text-lg font-semibold text-[#5b2333]">Total Orders</h2>
            </div>
            <p className="text-3xl font-bold text-black mt-2">326</p>
            <p className="text-sm text-red-600">-5% this week</p>
            <button
              className="text-blue-600 text-sm mt-2"
              onClick={() => setShowOrderDetails(!showOrderDetails)}
            >
              {showOrderDetails ? "Hide Details ▲" : "Show Details ▼"}
            </button>
            {showOrderDetails && (
              <ul className="text-sm text-gray-600 mt-2 space-y-1">
                <li>245 Completed</li>
                <li>56 In Transit</li>
                <li>25 Processing</li>
              </ul>
            )}
          </div>

          {/* Monthly Revenue */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-2">
              <Box className="h-5 w-5 text-[#5b2333]" />
              <h2 className="text-lg font-semibold text-[#5b2333]">Monthly Revenue</h2>
            </div>
            <p className="text-3xl font-bold text-black mt-2">£156,000</p>
            <p className="text-sm text-green-600">+12% this month</p>
            <button
              className="text-blue-600 text-sm mt-2"
              onClick={() => setShowRevenueDetails(!showRevenueDetails)}
            >
              {showRevenueDetails ? "Hide Details ▲" : "Show Details ▼"}
            </button>
            {showRevenueDetails && (
              <ul className="text-sm text-gray-600 mt-2 space-y-1">
                <li>£98,000 from Premium Partners</li>
                <li>£58,000 from Standard Partners</li>
                <li>98.5% Payment Success Rate</li>
              </ul>
            )}
          </div>
        </div>

        {/* Supermarkets Supplied Section */}
        <section className="mt-6">
          <SupermarketsSupplied />
        </section>

        {/* Current Inventory Section */}
        <section className="bg-white p-6 rounded-lg shadow-md mt-6">
          <h2 className="text-xl font-semibold text-[#5b2333]">Current Inventory</h2>
          <p className="text-sm text-gray-700 mt-2">
            {inventoryItems.length} items in stock, 1 low stock alert
          </p>

          {/* Inventory List */}
          <div className="mt-4">
            {inventoryItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center py-3 border-b">
                <div>
                  <h3 className="text-lg font-semibold text-black">{item.name}</h3>
                  <p className="text-sm text-gray-600">SKU: {item.sku} • Last Updated: {item.lastUpdated}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-black">{item.stock} units</p>
                  <span
                    className={`text-sm font-semibold px-3 py-1 rounded-full ${
                      item.status === "In Stock" ? "bg-green-200 text-green-800" :
                      item.status === "Low Stock" ? "bg-yellow-200 text-yellow-800" :
                      "bg-red-200 text-red-800"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default SupplierDashboard;
