import { useEffect, useState } from "react";
import { GET } from "../utils/api"; // ✅ use API

function RoomLayout({ campId }) {
  const [layout, setLayout] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // =========================
  // 🔄 FETCH DATA
  // =========================
  useEffect(() => {
    const fetchLayout = async () => {
      try {
        if (!campId) return;

        setLoading(true);

        const data = await GET(`/layout?camp_id=${campId}`);
        setLayout(data);

      } catch (err) {
        console.error("Layout error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLayout();
  }, [campId]);

  // =========================
  // ⏳ LOADING
  // =========================
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-xl">
        Loading layout...
      </div>
    );
  }

  // =========================
  // ❌ ERROR
  // =========================
  if (error) {
    return (
      <div className="p-8 text-red-500 text-lg">
        {error}
      </div>
    );
  }

  // =========================
  // 🚫 NO CAMP
  // =========================
  if (!campId) {
    return (
      <div className="p-8 text-gray-600 text-lg">
        No camp assigned
      </div>
    );
  }

  // =========================
  // ❌ EMPTY
  // =========================
  if (layout.length === 0) {
    return (
      <div className="p-8 text-gray-500 text-lg">
        No rooms or beds available
      </div>
    );
  }

  // =========================
  // 🧠 GROUP ROOMS
  // =========================
  const groupedRooms = layout.reduce((acc, item) => {
    if (!acc[item.room_number]) {
      acc[item.room_number] = [];
    }
    acc[item.room_number].push(item);
    return acc;
  }, {});

  return (
    <div className="p-8 bg-gray-100 min-h-screen">

      <h1 className="text-2xl font-bold mb-6">Room Layout</h1>

      <div className="grid grid-cols-4 gap-6">

        {Object.entries(groupedRooms).map(([room, beds]) => (
          <div
            key={room}
            className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition"
          >
            <h2 className="text-lg font-semibold mb-3">
              Room {room}
            </h2>

            <div className="space-y-2">
              {beds.map((b) => (
                <div
                  key={b.bed_id}
                  className={`p-3 rounded-lg text-sm text-white flex justify-between items-center ${
                    b.worker_name ? "bg-red-500" : "bg-green-500"
                  }`}
                >
                  <span className="font-medium">
                    Bed {b.bed_number}
                  </span>

                  <span className="text-xs">
                    {b.worker_name || "Empty"}
                  </span>
                </div>
              ))}
            </div>

          </div>
        ))}

      </div>

    </div>
  );
}

export default RoomLayout;