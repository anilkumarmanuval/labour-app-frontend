import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/logo.png";

import {
  LayoutDashboard,
  Users,
  Bed,
  Layers,
  LogOut,
  Cpu,
  FileSpreadsheet
} from "lucide-react";

// 🔥 ROLE CONSTANTS
const ROLES = {
  SUPERADMIN: "superadmin",
  CAMPADMIN: "campadmin"
};

// 🔥 MENU CONFIG
const MENU = {
  common: [
    {
      path: "/",
      label: "Dashboard",
      icon: LayoutDashboard
    }
  ],

  // 🔴 SUPER ADMIN
  superadmin: [

    {
      path: "/all-workers",
      label: "Employee Management",
      icon: Users
    },

    {
  path: "/room-management",
  label: "Room Management",
  icon: Bed
},

{
  path: "/devices",
  label: "Devices",
  icon: Cpu
},
{
  path: "/reports",
  label: "Reports",
  icon: FileSpreadsheet
}
  ],

  // 🟡 CAMP ADMIN
  campadmin: [

    {
      path: "/workers",
      label: "Workers",
      icon: Users
    },

    {
      path: "/room-allocation",
      label: "Room Allocation",
      icon: Bed
    },

    {
      path: "/attendance",
      label: "Attendance",
      icon: Layers
    }

  ]
};

function Sidebar({ role }) {

  // 🔐 AUTH
  const { logout } = useAuth();

  // 🎨 ACTIVE LINK STYLE
  const linkStyle = (isActive) =>
    `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition ${
      isActive
        ? "bg-blue-600 text-white shadow"
        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
    }`;

  // 🔗 RENDER LINKS
  const renderLinks = (links) =>
    links.map((item) => {
      const Icon = item.icon;

      return (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => linkStyle(isActive)}
        >
          <Icon size={18} />
          {item.label}
        </NavLink>
      );
    });

  return (
    <div className="w-64 h-screen bg-white dark:bg-gray-900 shadow-xl p-6 fixed flex flex-col justify-between">

      {/* 🔷 TOP */}
      <div>

{/* LOGO */}
<div className="mb-2 flex flex-col items-center text-center -mt-4">
    <img
    src={logo}
    alt="Company Logo"
    className="w-50 h-40 object-contain mb-1"
  />

  <h2 className="text-xl font-bold text-blue-600 leading-tight">
    EOG Camp
    <br />
    Management System
  </h2>

  <p className="text-xs text-gray-400 uppercase tracking-wide mt-3">
    {role === ROLES.SUPERADMIN
      ? "Super Admin"
      : role === ROLES.CAMPADMIN
      ? "Camp Admin"
      : "User"}
  </p>

</div>

        {/* NAVIGATION */}
        <nav className="flex flex-col gap-2">

          {/* COMMON */}
          {renderLinks(MENU.common)}

          {/* 🔴 SUPERADMIN */}
          {role === ROLES.SUPERADMIN && (
            <>
              <p className="mt-6 mb-2 text-xs text-gray-400 uppercase">
                Management
              </p>

              {renderLinks(MENU.superadmin)}
            </>
          )}

          {/* 🟡 CAMPADMIN */}
          {role === ROLES.CAMPADMIN && (
            <>
              <p className="mt-6 mb-2 text-xs text-gray-400 uppercase">
                Camp Controls
              </p>

              {renderLinks(MENU.campadmin)}
            </>
          )}

        </nav>

      </div>

      {/* 🔻 LOGOUT */}
      <button
        onClick={logout}
        className="flex items-center justify-center gap-2 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition font-medium"
      >
        <LogOut size={16} />
        Logout
      </button>

    </div>
  );
}

export default Sidebar;