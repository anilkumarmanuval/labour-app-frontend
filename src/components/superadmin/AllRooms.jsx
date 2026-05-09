import { useEffect, useMemo, useState } from "react";
import { GET } from "../../utils/api";

import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

function AllRooms() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // 🔄 FETCH
  // =========================
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        setError("");

        const result = await GET("/all-rooms");

        setData(result);

      } catch (err) {
        console.error("All rooms error:", err);
        setError(err.message || "Failed to load room data");
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  // =========================
  // 📊 CHART DATA
  // =========================
  const workersPerCamp = useMemo(() => {
    return (data?.chart || []).map((item) => ({
      ...item,
      workers: Number(item.workers || 0)
    }));
  }, [data]);

  // =========================
  // 🥧 PIE DATA
  // =========================
  const pieData = useMemo(() => {
    const usedBeds = Number(data?.usedBeds || 0);
    const totalBeds = Number(data?.totalBeds || 0);

    return [
      {
        name: "Used",
        value: usedBeds
      },
      {
        name: "Empty",
        value: Math.max(0, totalBeds - usedBeds)
      }
    ];
  }, [data]);

  // =========================
  // 📋 ROOMS
  // =========================
  const rooms = data?.rooms || [];

  // =========================
  // ⏳ LOADING
  // =========================
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px] text-lg">
        Loading room analytics...
      </div>
    );
  }

  // =========================
  // ❌ ERROR
  // =========================
  if (error) {
    return (
      <div className="bg-red-100 text-red-600 p-4 rounded-xl">
        {error}
      </div>
    );
  }

  // =========================
  // ❌ EMPTY
  // =========================
  if (!data) {
    return (
      <div className="bg-yellow-100 text-yellow-700 p-4 rounded-xl">
        No room data found
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* ========================= */}
      {/* 📊 ANALYTICS */}
      {/* ========================= */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* 📈 BAR CHART */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow">

          <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
            Workers Per Camp
          </h2>

          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={workersPerCamp}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />

              <Bar
                dataKey="workers"
                fill="#3b82f6"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>

        </div>

        {/* 🥧 PIE CHART */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow">

          <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
            Bed Usage
          </h2>

          <ResponsiveContainer width="100%" height={280}>
            <PieChart>

              <Pie
                data={pieData}
                dataKey="value"
                outerRadius={90}
                label
              >
                <Cell fill="#22c55e" />
                <Cell fill="#ef4444" />
              </Pie>

              <Tooltip />
              <Legend />

            </PieChart>
          </ResponsiveContainer>

        </div>

      </div>

      {/* ========================= */}
      {/* 📋 TABLE */}
      {/* ========================= */}

      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow">

        <div className="flex justify-between items-center mb-6">

          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            All Rooms
          </h2>

          <div className="text-sm text-gray-500">
            Total Rooms: {rooms.length}
          </div>

        </div>

        {/* 🧾 TABLE */}
        <div className="overflow-x-auto">

          <table className="w-full text-left border-collapse">

            <thead>
              <tr className="border-b dark:border-gray-700">

                <th className="p-3 text-sm font-semibold">
                  Room
                </th>

                <th className="p-3 text-sm font-semibold">
                  Bed
                </th>

                <th className="p-3 text-sm font-semibold">
                  Worker
                </th>

                <th className="p-3 text-sm font-semibold">
                  Camp
                </th>

                <th className="p-3 text-sm font-semibold">
                  Status
                </th>

              </tr>
            </thead>

            <tbody>

              {rooms.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="p-6 text-center text-gray-500"
                  >
                    No rooms available
                  </td>
                </tr>
              ) : (
                rooms.map((room) => {
                  const occupied = !!room.worker_name;

                  return (
                    <tr
                      key={`${room.room_number}-${room.bed_number}`}
                      className="border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                    >

                      <td className="p-3">
                        {room.room_number}
                      </td>

                      <td className="p-3">
                        {room.bed_number}
                      </td>

                      <td className="p-3">
                        {room.worker_name || "Empty"}
                      </td>

                      <td className="p-3">
                        {room.camp_name || "Unknown"}
                      </td>

                      <td className="p-3">

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            occupied
                              ? "bg-red-100 text-red-600"
                              : "bg-green-100 text-green-600"
                          }`}
                        >
                          {occupied ? "Occupied" : "Available"}
                        </span>

                      </td>

                    </tr>
                  );
                })
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default AllRooms;