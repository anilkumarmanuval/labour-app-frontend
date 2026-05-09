import { useEffect, useState } from "react";
import { GET, POST } from "../utils/api"; // ✅ API

function Attendance({ campId }) {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  // =========================
  // 📥 FETCH
  // =========================
  const fetchAttendance = async () => {
    try {
      if (!campId) return;

      setLoading(true);

      const data = await GET(`/attendance?camp_id=${campId}`);
      setWorkers(data);

    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [campId]);

  // =========================
  // ✅ MARK
  // =========================
  const mark = async (id, status) => {
    try {
      await POST("/attendance", {
        worker_id: id,
        status
      });

      fetchAttendance();

    } catch (err) {
      alert(err.message);
    }
  };

  // =========================
  // 📥 DOWNLOAD
  // =========================
  const download = async (url, name) => {
    try {
      if (!campId) return alert("Camp ID missing");

      const res = await fetch(`http://localhost:5000${url}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      if (!res.ok) throw new Error("Download failed");

      const blob = await res.blob();
      const a = document.createElement("a");

      a.href = URL.createObjectURL(blob);
      a.download = name;
      a.click();

    } catch (err) {
      alert(err.message);
    }
  };

  // =========================
  // ⏳ LOADING
  // =========================
  if (loading) {
    return <div className="p-8 text-lg">Loading attendance...</div>;
  }

  // =========================
  // ❌ ERROR
  // =========================
  if (error) {
    return <div className="p-8 text-red-500">{error}</div>;
  }

  // =========================
  // ❌ EMPTY
  // =========================
  if (workers.length === 0) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Attendance</h1>
        <p>No workers found</p>
      </div>
    );
  }

  return (
    <div className="p-8">

      {/* 🔥 HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Attendance</h1>

        {user?.role === "superadmin" && (
          <div className="space-x-2">
            <button
              onClick={() =>
                download(`/report/attendance?camp_id=${campId}`, "attendance.xlsx")
              }
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Excel
            </button>

            <button
              onClick={() =>
                download(`/report/attendance/pdf?camp_id=${campId}`, "attendance.pdf")
              }
              className="bg-purple-600 text-white px-4 py-2 rounded"
            >
              PDF
            </button>
          </div>
        )}
      </div>

      {/* 📋 LIST */}
      <div className="space-y-3">
        {workers.map((w) => (
          <div
            key={w.id}
            className="flex justify-between items-center p-4 bg-white rounded shadow"
          >
            <span className="font-medium">{w.name}</span>

            <div className="space-x-2">
              <button
                onClick={() => mark(w.id, "Present")}
                className={`px-3 py-1 rounded ${
                  w.status === "Present"
                    ? "bg-green-600 text-white"
                    : "bg-gray-200"
                }`}
              >
                Present
              </button>

              <button
                onClick={() => mark(w.id, "Absent")}
                className={`px-3 py-1 rounded ${
                  w.status === "Absent"
                    ? "bg-red-600 text-white"
                    : "bg-gray-200"
                }`}
              >
                Absent
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

export default Attendance;