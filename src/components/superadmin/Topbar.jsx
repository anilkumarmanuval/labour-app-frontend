import { Bell, Search } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function Topbar() {
  const { user } = useAuth();

  const roleLabel = {
    superadmin: "Super Admin",
    campadmin: "Camp Admin"
  };

  const initial = (user?.email?.charAt(0) || "U").toUpperCase();

  return (
    <div className="w-full bg-white dark:bg-gray-900 shadow-sm px-6 py-4 flex justify-between items-center">

      {/* 🔍 Search */}
      <div className="flex items-center bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-xl w-1/3">
        <Search size={18} className="text-gray-500" />

        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent outline-none ml-2 w-full text-sm text-gray-700 dark:text-white"
        />
      </div>

      {/* 🔔 Right */}
      <div className="flex items-center gap-6">

        {/* Notification */}
        <div className="relative cursor-pointer">
          <Bell size={20} className="text-gray-600 dark:text-gray-300" />

          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
            2
          </span>
        </div>

        {/* 👤 Profile */}
        <div className="flex items-center gap-3 cursor-pointer">

          {/* Avatar */}
          <div className="w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
            {initial}
          </div>

          {/* Info */}
          <div className="flex flex-col leading-tight">

            <span className="text-sm font-medium text-gray-800 dark:text-white">
              {user?.email || "User"}
            </span>

            <span className="text-xs text-gray-400">
              {roleLabel[user?.role] || "User"}
            </span>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Topbar;