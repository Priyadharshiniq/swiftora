import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { 
  FaHome, FaStore, FaWarehouse, FaClipboardList, 
  FaBox, FaBell, FaUser, FaSignOutAlt, FaBars, FaTimes 
} from "react-icons/fa";
import logo from "../assets/logo1.png"; // Ensure the correct path

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Sidebar Toggle Button (Mobile) - Positioned at the Right */}
      <button
        className="lg:hidden fixed top-4 right-4 z-50 bg-[#87475a] text-white p-2 rounded-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed lg:relative top-0 left-0 h-screen w-64 bg-[#5b2333] text-white flex flex-col shadow-lg transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Logo and App Name (Left-Aligned) */}
        <div className="flex items-center py-4 px-6 border-b border-white gap-3">
          <img src={logo} alt="Swiftora Logo" className="w-10 h-10 rounded-full" />
          <h1 className="text-lg font-semibold">Swiftora</h1>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col flex-1 mt-4">
          <NavLink
            to="/supplier-dashboard"
            className="flex items-center gap-3 px-6 py-3 text-lg transition-all duration-300 hover:bg-[#87475a]"
          >
            <FaHome className="text-xl" /> Dashboard
          </NavLink>
          <NavLink
            to="/supplier-profile"
            className="flex items-center gap-3 px-6 py-3 text-lg transition-all duration-300 hover:bg-[#87475a]"
          >
            <FaUser className="text-xl" /> Profile
          </NavLink>
          <NavLink
            to="/supplier-supermarkets-supplied"
            className="flex items-center gap-3 px-6 py-3 text-lg transition-all duration-300 hover:bg-[#87475a]"
          >
            <FaStore className="text-xl" /> My Supermarkets
          </NavLink>
          <NavLink
            to="/supplier-warehouses"
            className="flex items-center gap-3 px-6 py-3 text-lg transition-all duration-300 hover:bg-[#87475a]"
          >
            <FaWarehouse className="text-xl" /> My Warehouses
          </NavLink>
          <NavLink
            to="/supplier-my-orders"
            className="flex items-center gap-3 px-6 py-3 text-lg transition-all duration-300 hover:bg-[#87475a]"
          >
            <FaClipboardList className="text-xl" /> My Orders
          </NavLink>
          <NavLink
            to="/supplier-current-inventory"
            className="flex items-center gap-3 px-6 py-3 text-lg transition-all duration-300 hover:bg-[#87475a]"
          >
            <FaBox className="text-xl" /> Current Inventory
          </NavLink>
          <NavLink
            to="/supplier-notifications"
            className="flex items-center gap-3 px-6 py-3 text-lg transition-all duration-300 hover:bg-[#87475a]"
          >
            <FaBell className="text-xl" /> Notifications
          </NavLink>
        </nav>

        {/* Logout Button */}
        <div className="mt-auto">
          <NavLink
            to="/"
            className="flex items-center gap-3 px-6 py-3 text-lg transition-all duration-300 hover:bg-[#87475a]"
          >
            <FaSignOutAlt className="text-xl" /> Logout
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
