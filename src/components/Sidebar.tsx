"use client";

import { useState } from "react";
import { FaBars, FaUser, FaClock, FaCalendarAlt, FaCheckSquare, FaQuestionCircle, FaCog, FaThLarge } from "react-icons/fa";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const menuItems = [
    { icon: <FaThLarge />, label: "Dashboard" },
    { icon: <FaUser />, label: "Karyawan" },
    { icon: <FaClock />, label: "Kehadiran" },
    { icon: <FaCalendarAlt />, label: "Jadwal" },
    { icon: <FaCheckSquare />, label: "Approval" },
  ];

  return (
    <div className={`h-screen bg-white border-r transition-all duration-300 ${isOpen ? "w-64" : "w-20"}`}>
      <div className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="h-8 w-8" />
          {isOpen && <span className="font-bold text-blue-900">HRIS</span>}
        </div>
        <button onClick={toggleSidebar} className="text-blue-900">
          <FaBars />
        </button>
      </div>
      <ul className="mt-4">
        {menuItems.map((item, index) => (
          <li key={index} className="flex items-center px-4 py-2 hover:bg-blue-100 text-blue-900">
            <div className="text-lg">{item.icon}</div>
            {isOpen && <span className="ml-3">{item.label}</span>}
          </li>
        ))}
      </ul>
      <div className="absolute bottom-10 w-full">
        <ul>
          <li className="flex items-center px-4 py-2 hover:bg-blue-100 text-blue-900">
            <FaQuestionCircle />
            {isOpen && <span className="ml-3">Need help?</span>}
          </li>
          <li className="flex items-center px-4 py-2 hover:bg-blue-100 text-blue-900">
            <FaCog />
            {isOpen && <span className="ml-3">Settings</span>}
          </li>
        </ul>
      </div>
    </div>
  );
}
