import { useEffect, useState } from "react";
import { GET } from "../utils/api";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

import {
  Users,
  BedDouble,
  Building2,
  CheckCircle,
  XCircle
} from "lucide-react";

function Dashboard({ role, campId }) {

  const [stats, setStats] = useState(null);

  const [layout, setLayout] = useState([]);

  const [adminData, setAdminData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);

  // =========================
  // 🔄 FETCH DATA
  // =========================
  useEffect(() => {

    const fetchData = async () => {

      try {

        setLoading(true);

        // 🟡 CAMP ADMIN
        if (role === "campadmin") {

          if (!campId) {
            throw new Error(
              "Camp ID missing"
            );
          }

          const statsData =
            await GET(
              `/dashboard?camp_id=${campId}`
            );

          const layoutData =
            await GET(
              `/layout?camp_id=${campId}`
            );

          setStats(statsData);

          setLayout(layoutData);

        }

        // 🔴 SUPER ADMIN
        if (role === "superadmin") {

          const data =
            await GET(
              "/admin-dashboard"
            );

          setAdminData(data);

        }

      } catch (err) {

        console.error(
          "Dashboard error:",
          err
        );

        setError(err.message);

      } finally {

        setLoading(false);

      }

    };

    fetchData();

  }, [role, campId]);

  // =========================
  // 📥 DOWNLOAD
  // =========================
  const download = async (
    url,
    name
  ) => {

    try {

      const res = await fetch(
        `http://localhost:5000${url}`,
        {
          headers: {
            Authorization:
              `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      if (!res.ok) {
        throw new Error(
          "Download failed"
        );
      }

      const blob =
        await res.blob();

      const a =
        document.createElement("a");

      a.href =
        URL.createObjectURL(blob);

      a.download = name;

      a.click();

    } catch (err) {

      console.error(err);

      alert(err.message);

    }

  };

  // =========================
  // ⏳ LOADING
  // =========================
  if (loading) {

    return (
      <div className="
        p-8
        text-lg
      ">
        Loading dashboard...
      </div>
    );

  }

  // =========================
  // ❌ ERROR
  // =========================
  if (error) {

    return (
      <div className="
        p-8
        text-red-500
      ">
        {error}
      </div>
    );

  }

  // =========================
  // 🔴 SUPER ADMIN
  // =========================
  if (
    role === "superadmin" &&
    adminData
  ) {

    return (

      <div className="space-y-8">

        {/* HEADER */}
        <div className="
          bg-gradient-to-r
          from-blue-600
          to-indigo-700
          text-white
          p-8
          rounded-3xl
          shadow-xl
          flex
          justify-between
          items-center
          flex-wrap
          gap-4
        ">

          <div>

            <h1 className="
              text-3xl
              font-bold
            ">
              Super Admin Dashboard
            </h1>

            <p className="
              text-blue-100
              mt-2
            ">
              Workforce Management Overview
            </p>

          </div>

          <div className="
            flex
            gap-3
            flex-wrap
          ">

            <button
              onClick={() =>
                download(
                  `/report/attendance?camp_id=${campId}`,
                  "attendance.xlsx"
                )
              }
              className="
                bg-white
                text-blue-600
                px-4
                py-2
                rounded-xl
                font-medium
                hover:scale-105
                transition
              "
            >
              Attendance Excel
            </button>

            <button
              onClick={() =>
                download(
                  `/report/mess?camp_id=${campId}`,
                  "mess.xlsx"
                )
              }
              className="
                bg-white
                text-green-600
                px-4
                py-2
                rounded-xl
                font-medium
                hover:scale-105
                transition
              "
            >
              Mess Excel
            </button>

            <button
              onClick={() =>
                download(
                  `/report/rooms?camp_id=${campId}`,
                  "rooms.xlsx"
                )
              }
              className="
                bg-white
                text-orange-600
                px-4
                py-2
                rounded-xl
                font-medium
                hover:scale-105
                transition
              "
            >
              Room Excel
            </button>

          </div>

        </div>

        {/* STATS */}
        <div className="
          grid
          grid-cols-1
          md:grid-cols-3
          gap-6
        ">

          <Stat
            title="Total Camps"
            value={
              adminData?.camps?.length || 0
            }
            icon={Building2}
            color="
              from-orange-500
              to-red-500
            "
          />

          <Stat
            title="Total Workers"
            value={
              adminData?.workers?.length || 0
            }
            icon={Users}
            color="
              from-blue-500
              to-indigo-600
            "
          />

          <Stat
            title="Total Beds"
            value={
              adminData?.beds || 0
            }
            icon={BedDouble}
            color="
              from-green-500
              to-emerald-600
            "
          />

        </div>

        {/* CHART */}
        <Chart
          data={
            adminData?.chart || []
          }
        />

      </div>

    );

  }

  // =========================
  // 🟡 CAMP ADMIN
  // =========================
  if (
    role === "campadmin" &&
    stats
  ) {

    const present =
      stats?.occupied || 0;

    const absent =
      (stats?.workers || 0)
      - present;

    return (

      <div className="
        space-y-8
      ">

        {/* HEADER */}
        <div className="
          bg-gradient-to-r
          from-green-500
          to-emerald-600
          text-white
          p-8
          rounded-3xl
          shadow-xl
        ">

          <h1 className="
            text-3xl
            font-bold
          ">
            Camp Dashboard
          </h1>

          <p className="
            mt-2
            text-green-100
          ">
            Real-time workforce overview
          </p>

        </div>

        {/* STATS */}
        <div className="
          grid
          grid-cols-1
          md:grid-cols-3
          gap-6
        ">

          <Stat
            title="Workers"
            value={
              stats?.workers || 0
            }
            icon={Users}
            color="
              from-blue-500
              to-indigo-600
            "
          />

          <Stat
            title="Rooms"
            value={
              stats?.rooms || 0
            }
            icon={BedDouble}
            color="
              from-green-500
              to-emerald-600
            "
          />

          <Stat
            title="Beds Used"
            value={
              stats?.occupied || 0
            }
            icon={Building2}
            color="
              from-orange-500
              to-red-500
            "
          />

        </div>

        {/* ATTENDANCE SUMMARY */}
        <div className="
          grid
          grid-cols-1
          md:grid-cols-2
          gap-6
        ">

          <div className="
            bg-green-500
            text-white
            p-6
            rounded-3xl
            shadow-lg
          ">

            <div className="
              flex
              justify-between
              items-center
            ">

              <div>

                <h3 className="
                  text-lg
                  font-semibold
                ">
                  Present Today
                </h3>

                <p className="
                  text-5xl
                  font-bold
                  mt-3
                ">
                  {present}
                </p>

              </div>

              <CheckCircle size={50} />

            </div>

          </div>

          <div className="
            bg-red-500
            text-white
            p-6
            rounded-3xl
            shadow-lg
          ">

            <div className="
              flex
              justify-between
              items-center
            ">

              <div>

                <h3 className="
                  text-lg
                  font-semibold
                ">
                  Empty Beds
                </h3>

                <p className="
                  text-5xl
                  font-bold
                  mt-3
                ">
                  {absent}
                </p>

              </div>

              <XCircle size={50} />

            </div>

          </div>

        </div>

        {/* ROOM TABLE */}
        <div className="
          bg-white
          p-8
          rounded-3xl
          shadow-xl
        ">

          <div className="
            flex
            justify-between
            items-center
            mb-6
          ">

            <h3 className="
              text-2xl
              font-bold
            ">
              Room Assignments
            </h3>

          </div>

          <div className="
            overflow-x-auto
          ">

            <table className="
              w-full
              text-left
            ">

              <thead>

                <tr className="
                  bg-gray-100
                  text-gray-700
                ">

                  <th className="
                    p-4
                    rounded-l-xl
                  ">
                    Room
                  </th>

                  <th className="
                    p-4
                  ">
                    Bed
                  </th>

                  <th className="
                    p-4
                    rounded-r-xl
                  ">
                    Worker
                  </th>

                </tr>

              </thead>

              <tbody>

                {layout.map((r) => (

                  <tr
                    key={r.bed_id}
                    className="
                      border-b
                      hover:bg-gray-50
                      transition
                    "
                  >

                    <td className="
                      p-4
                      font-medium
                    ">
                      {r.room_number}
                    </td>

                    <td className="
                      p-4
                    ">
                      {r.bed_number}
                    </td>

                    <td className="
                      p-4
                    ">

                      {r.worker_name ? (

                        <span className="
                          bg-green-100
                          text-green-700
                          px-3
                          py-1
                          rounded-full
                          text-sm
                          font-medium
                        ">
                          {r.worker_name}
                        </span>

                      ) : (

                        <span className="
                          bg-gray-200
                          text-gray-600
                          px-3
                          py-1
                          rounded-full
                          text-sm
                        ">
                          Empty
                        </span>

                      )}

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    );

  }

  return (
    <div className="
      p-8
      text-gray-500
    ">
      No data available
    </div>
  );

}

// =========================
// 📊 STAT CARD
// =========================
function Stat({
  title,
  value,
  icon: Icon,
  color
}) {

  return (

    <div className={`
      bg-gradient-to-r
      ${color}
      text-white
      p-6
      rounded-3xl
      shadow-lg
      hover:scale-105
      transition
    `}>

      <div className="
        flex
        justify-between
        items-center
      ">

        <div>

          <p className="
            text-sm
            opacity-80
          ">
            {title}
          </p>

          <h2 className="
            text-4xl
            font-bold
            mt-2
          ">
            {value}
          </h2>

        </div>

        <Icon size={45} />

      </div>

    </div>

  );

}

// =========================
// 📈 CHART
// =========================
function Chart({ data }) {

  const fixedData =
    (data || []).map(d => ({
      ...d,
      workers: Number(d.workers)
    }));

  return (

    <div className="
      bg-white
      p-8
      rounded-3xl
      shadow-xl
    ">

      <h3 className="
        text-2xl
        font-bold
        mb-6
      ">
        Workers per Camp
      </h3>

      <ResponsiveContainer
        width="100%"
        height={320}
      >

        <LineChart data={fixedData}>

          <XAxis dataKey="name" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="workers"
            stroke="#4f46e5"
            strokeWidth={4}
          />

        </LineChart>

      </ResponsiveContainer>

    </div>

  );

}

export default Dashboard;