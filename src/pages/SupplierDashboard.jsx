import React from "react";
import Sidebar from "../components/Sidebar";

const SupplierDashboard = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 bg-[#f7f4f3]">
        <h1 className="text-3xl font-semibold text-[#5b2333]">Supplier Dashboard</h1>

        {/* Profile Overview Section */}
        <section className="bg-white p-6 rounded-lg shadow-md mt-6">
          <h2 className="text-xl font-semibold text-[#5b2333]">Profile Overview</h2>
          <p className="text-sm mt-2 text-gray-700">Name: John Doe</p>
          <p className="text-sm text-gray-700">Contact: +91 98765 43210</p>
          <p className="text-sm text-gray-700">Email: johndoe@example.com</p>
        </section>

        {/* My Supermarket Tie-ups Section */}
        <section className="bg-white p-6 rounded-lg shadow-md mt-6">
          <h2 className="text-xl font-semibold text-[#5b2333]">My Supermarkets</h2>
          <p className="text-sm mt-2 text-gray-700">List of supermarkets you are supplying to.</p>
        </section>

        {/* My Warehouse Tie-ups Section */}
        <section className="bg-white p-6 rounded-lg shadow-md mt-6">
          <h2 className="text-xl font-semibold text-[#5b2333]">My Warehouses</h2>
          <p className="text-sm mt-2 text-gray-700">Warehouses managing your stock.</p>
        </section>

        {/* Notifications Section */}
        <section className="bg-white p-6 rounded-lg shadow-md mt-6">
          <h2 className="text-xl font-semibold text-[#5b2333]">Notifications</h2>
          <p className="text-sm mt-2 text-gray-700">You have 3 new updates.</p>
        </section>
      </div>
    </div>
  );
};

export default SupplierDashboard;
