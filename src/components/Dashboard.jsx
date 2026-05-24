import {
  useEffect,
  useState,
  useCallback
} from "react";

import { GET }
from "../utils/api";

import {

  Users,
  Utensils,
  BedDouble,
  Activity,
  Wifi,
  WifiOff,
  LogOut,
  Clock

} from "lucide-react";

function Dashboard({
  role,
  campId
}) {

  const [dashboard, setDashboard] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);

  const [currentTime, setCurrentTime] =
    useState(
      new Date()
    );

  // =====================================
  // FETCH DASHBOARD
  // =====================================

  const fetchDashboard =
    useCallback(

      async (signal) => {

        try {

          setError(null);

          let url =
            "/dashboard/live";

          if (
            role ===
            "campadmin"
          ) {

            if (!campId) {

              throw new Error(
                "Camp ID missing"
              );

            }

            url +=
              `?camp_id=${campId}`;

          }

          const data =
            await GET(
              url,
              { signal }
            );

          setDashboard(data);

        } catch (err) {

          if (
            err.name !==
            "AbortError"
          ) {

            console.error(
              "Dashboard error:",
              err
            );

            setError(
              err.message
            );

          }

        } finally {

          setLoading(false);

        }

      },

      [role, campId]
    );

  // =====================================
  // INITIAL LOAD
  // =====================================

  useEffect(() => {

    const controller =
      new AbortController();

    fetchDashboard(
      controller.signal
    );

    return () =>
      controller.abort();

  }, [fetchDashboard]);

  // =====================================
  // AUTO REFRESH
  // =====================================

  useEffect(() => {

    const interval =
      setInterval(() => {

        fetchDashboard();

      }, 10000);

    return () =>
      clearInterval(
        interval
      );

  }, [fetchDashboard]);

  // =====================================
  // LIVE CLOCK
  // =====================================

  useEffect(() => {

    const timer =
      setInterval(() => {

        setCurrentTime(
          new Date()
        );

      }, 1000);

    return () =>
      clearInterval(timer);

  }, []);

  // =====================================
  // LOADING
  // =====================================

  if (
    loading &&
    !dashboard
  ) {

    return (

      <div className="
        p-8
        text-gray-500
      ">
        Loading dashboard...
      </div>

    );

  }

  // =====================================
  // ERROR
  // =====================================

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

  // =====================================
  // DATA
  // =====================================

  const stats =
    dashboard?.stats || {};

  const devices =
    dashboard?.devices || [];

  // =====================================
  // UI
  // =====================================

  return (

    <div className="
      p-6
      space-y-8
      bg-gray-50
      min-h-screen
    ">

      {/* HEADER */}

      <div className="
        bg-gradient-to-r
        from-indigo-600
        to-blue-600

        text-white

        p-8
        rounded-3xl
        shadow-xl

        flex
        justify-between
        items-center
      ">

        <div>

          <h1 className="
            text-4xl
            font-bold
          ">
            Operations Dashboard
          </h1>

          <p className="
            mt-2
            text-indigo-100
          ">
            Real-time labour camp monitoring
          </p>

        </div>

        <div className="
          text-right
        ">

          <div className="
            flex
            items-center
            gap-2
            justify-end
          ">

            <Clock size={18} />

            <span className="
              text-lg
              font-medium
            ">
              {currentTime.toLocaleTimeString()}
            </span>

          </div>

          <div className="
            text-indigo-100
            mt-1
            text-sm
          ">
            {currentTime.toDateString()}
          </div>

        </div>

      </div>

      {/* LIVE STATS */}

      <div className="
        grid
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-4
        gap-6
      ">

        <StatCard
          title="Workers Inside"
          value={stats.inside || 0}
          icon={Users}
          color="from-blue-500 to-indigo-600"
        />

        <StatCard
          title="Checked Out"
          value={stats.checkedOut || 0}
          icon={LogOut}
          color="from-red-500 to-pink-600"
        />

        <StatCard
          title="Breakfast"
          value={stats.breakfast || 0}
          icon={Utensils}
          color="from-yellow-500 to-orange-500"
        />

        <StatCard
          title="Lunch"
          value={stats.lunch || 0}
          icon={Utensils}
          color="from-green-500 to-emerald-600"
        />

        <StatCard
          title="Dinner"
          value={stats.dinner || 0}
          icon={Utensils}
          color="from-purple-500 to-violet-600"
        />

        <StatCard
          title="Occupied Beds"
          value={stats.occupiedBeds || 0}
          icon={BedDouble}
          color="from-cyan-500 to-blue-500"
        />

        <StatCard
          title="Active Devices"
          value={stats.activeDevices || 0}
          icon={Activity}
          color="from-emerald-500 to-green-600"
        />

        <StatCard
          title="Total Workers"
          value={stats.totalWorkers || 0}
          icon={Users}
          color="from-gray-700 to-gray-900"
        />

      </div>

      {/* DEVICE STATUS */}

      <div className="
        bg-white
        rounded-3xl
        shadow-xl
        p-6
      ">

        <div className="
          flex
          justify-between
          items-center
          mb-6
        ">

          <h2 className="
            text-2xl
            font-bold
          ">
            Device Status
          </h2>

          <button
            onClick={() =>
              fetchDashboard()
            }
            className="
              bg-black
              text-white
              px-4
              py-2
              rounded-xl
              hover:bg-gray-800
              transition
            "
          >
            Refresh
          </button>

        </div>

        <div className="
          grid
          grid-cols-1
          md:grid-cols-2
          lg:grid-cols-3
          gap-5
        ">

          {devices.map((d) => (

            <div
              key={d.id}
              className="
                border
                rounded-2xl
                p-5
                hover:shadow-lg
                transition
                bg-gray-50
              "
            >

              <div className="
                flex
                justify-between
                items-start
              ">

                <div>

                  <h3 className="
                    text-lg
                    font-bold
                  ">
                    {d.device_name}
                  </h3>

                  <div className="
                    mt-2
                    flex
                    gap-2
                  ">

                    <span className="
                      px-3
                      py-1
                      rounded-full
                      text-xs
                      bg-indigo-100
                      text-indigo-700
                      font-medium
                    ">
                      {d.device_mode}
                    </span>

                    <span className={`
                      px-3
                      py-1
                      rounded-full
                      text-xs
                      font-medium

                      ${

                        d.status ===
                        "online"

                          ? "bg-green-100 text-green-700"

                          : "bg-red-100 text-red-700"

                      }
                    `}>

                      {d.status}

                    </span>

                  </div>

                </div>

                {

                  d.status ===
                  "online"

                    ? (
                      <Wifi className="
                        text-green-500
                      " />
                    )

                    : (
                      <WifiOff className="
                        text-red-500
                      " />
                    )

                }

              </div>

              <div className="
                mt-5
                text-sm
                text-gray-500
                space-y-1
              ">

                <div>
                  Serial:
                  {" "}
                  {d.serial_number}
                </div>

                <div>
                  Last Seen:
                  {" "}
                  {new Date(
                    d.last_seen
                  ).toLocaleString()}
                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>

  );

}

// =====================================
// STAT CARD
// =====================================

function StatCard({

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

      flex
      justify-between
      items-center

    `}>

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

      <Icon size={46} />

    </div>

  );

}

export default Dashboard;