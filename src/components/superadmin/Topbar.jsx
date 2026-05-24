import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Topbar() {

  const { user } =
    useAuth();

  const location =
    useLocation();

  // =====================================
  // PAGE TITLES
  // =====================================

  const titles = {

    "/":
      "Dashboard",

    "/all-workers":
      "Employee Management",

    "/workers":
      "Workers",

    "/room-management":
      "Room Management",

    "/room-allocation":
      "Room Allocation",

    "/attendance":
      "Attendance",

    "/reports":
      "Reports",

    "/cards":
      "Card Management",

    "/devices":
      "Device Management"

  };

  const currentTitle =
    titles[
      location.pathname
    ] || "EOG Camp";

  // =====================================
  // USER INFO
  // =====================================

  const roleLabel = {

    superadmin:
      "Super Admin",

    campadmin:
      "Camp Admin"

  };

  const initial =
    (
      user?.email
      ?.charAt(0)
      || "U"
    ).toUpperCase();

  // =====================================
  // DATE
  // =====================================

  const today =
    new Date()
    .toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }
    );

  return (

    <div className="
      w-full
      bg-white
      border-b
      border-gray-200
      px-8
      py-4
      flex
      justify-between
      items-center
      sticky
      top-0
      z-30
    ">

      {/* LEFT */}

      <div>

        <h1 className="
          text-2xl
          font-bold
          text-gray-900
        ">
          {currentTitle}
        </h1>

        <p className="
          text-sm
          text-gray-500
          mt-1
        ">
          {today}
        </p>

      </div>

      {/* RIGHT */}

      <div className="
        flex
        items-center
        gap-4
      ">

        {/* USER INFO */}

        <div className="
          text-right
        ">

          <p className="
            text-sm
            font-semibold
            text-gray-900
          ">
            {user?.email || "User"}
          </p>

          <p className="
            text-xs
            text-gray-500
          ">
            {
              roleLabel[
                user?.role
              ] || "User"
            }
          </p>

        </div>

        {/* AVATAR */}

        <div className="
          w-11
          h-11
          rounded-2xl
          bg-black
          text-white
          flex
          items-center
          justify-center
          font-bold
          text-lg
          shadow-sm
        ">

          {initial}

        </div>

      </div>

    </div>

  );

}

export default Topbar;