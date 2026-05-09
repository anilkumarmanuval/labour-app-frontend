import { useEffect, useState } from "react";
import { GET, POST, PUT } from "../utils/api"; // ✅ API

function RoomForm({ campId }) {
  const [rooms, setRooms] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [beds, setBeds] = useState([]);

  const [roomNumber, setRoomNumber] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [bedNumber, setBedNumber] = useState("");
  const [selectedWorker, setSelectedWorker] = useState("");

  const [error, setError] = useState(null);

  // =========================
  // 🔄 FETCH DATA
  // =========================
  useEffect(() => {
    if (!campId) return;

    fetchRooms();
    fetchWorkers();
  }, [campId]);

  const fetchRooms = async () => {
    try {
      const data = await GET(`/rooms?camp_id=${campId}`);
      setRooms(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchWorkers = async () => {
    try {
      const data = await GET("/workers");
      setWorkers(data.filter(w => w.camp_id === campId));
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchBeds = async (roomId) => {
    try {
      const data = await GET(`/beds?room_id=${roomId}`);
      setBeds(data);
    } catch (err) {
      setError(err.message);
    }
  };

  // =========================
  // 🟦 CREATE ROOM
  // =========================
  const handleAddRoom = async (e) => {
    e.preventDefault();

    if (!roomNumber.trim()) {
      return alert("Room number required");
    }

    try {
      await POST("/rooms", {
        room_number: roomNumber,
        camp_id: campId
      });

      setRoomNumber("");
      fetchRooms();

    } catch (err) {
      alert(err.message);
    }
  };

  // =========================
  // 🟪 ADD BED
  // =========================
  const handleAddBed = async (e) => {
    e.preventDefault();

    if (!bedNumber.trim()) {
      return alert("Bed number required");
    }

    try {
      await POST("/beds", {
        bed_number: bedNumber,
        room_id: selectedRoom
      });

      setBedNumber("");
      fetchBeds(selectedRoom);

    } catch (err) {
      alert(err.message);
    }
  };

  // =========================
  // 🟩 ASSIGN
  // =========================
  const handleAssign = async (bedId) => {
    if (!selectedWorker) {
      return alert("Select worker first");
    }

    try {
      await PUT("/beds/assign", {
        bed_id: bedId,
        worker_id: selectedWorker
      });

      fetchBeds(selectedRoom);

    } catch (err) {
      alert(err.message);
    }
  };

  // =========================
  // ❌ UNASSIGN
  // =========================
  const handleUnassign = async (bedId) => {
    try {
      await PUT("/beds/unassign", { bed_id: bedId });
      fetchBeds(selectedRoom);
    } catch (err) {
      alert(err.message);
    }
  };

  // =========================
  // ❌ ERROR UI
  // =========================
  if (error) {
    return <div className="p-8 text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6">

      {/* CREATE ROOM */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2>Create Room</h2>

        <form onSubmit={handleAddRoom} className="flex gap-4">
          <input
            value={roomNumber}
            onChange={(e) => setRoomNumber(e.target.value)}
            placeholder="Room Number"
            className="border p-2 rounded w-full"
          />
          <button className="bg-blue-500 text-white px-4 rounded">
            Add
          </button>
        </form>
      </div>

      {/* SELECT ROOM */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2>Select Room</h2>

        <select
          onChange={(e) => {
            setSelectedRoom(e.target.value);
            fetchBeds(e.target.value);
          }}
          className="border p-2 rounded w-full"
        >
          <option value="">Select Room</option>
          {rooms.map((r) => (
            <option key={r.id} value={r.id}>
              {r.room_number}
            </option>
          ))}
        </select>
      </div>

      {/* ADD BED */}
      {selectedRoom && (
        <div className="bg-white p-6 rounded-xl shadow">
          <h2>Add Bed</h2>

          <form onSubmit={handleAddBed} className="flex gap-4">
            <input
              value={bedNumber}
              onChange={(e) => setBedNumber(e.target.value)}
              placeholder="Bed Number"
              className="border p-2 rounded w-full"
            />
            <button className="bg-purple-500 text-white px-4 rounded">
              Add Bed
            </button>
          </form>
        </div>
      )}

      {/* ASSIGN */}
      {selectedRoom && (
        <div className="bg-white p-6 rounded-xl shadow">
          <h2>Assign Workers</h2>

          <select
            onChange={(e) => setSelectedWorker(e.target.value)}
            className="border p-2 mb-4 w-full"
          >
            <option>Select Worker</option>
            {workers.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </select>

          {beds.map((b) => {
            const occupied = b.worker_id;

            return (
              <div
                key={b.id}
                className={`flex justify-between p-3 rounded text-white ${
                  occupied ? "bg-red-500" : "bg-green-500"
                }`}
              >
                <span>
                  Bed {b.bed_number} — {occupied ? "Occupied" : "Available"}
                </span>

                {!occupied ? (
                  <button
                    onClick={() => handleAssign(b.id)}
                    className="bg-blue-500 px-3 rounded"
                  >
                    Assign
                  </button>
                ) : (
                  <button
                    onClick={() => handleUnassign(b.id)}
                    className="bg-yellow-500 px-3 rounded"
                  >
                    Unassign
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}

export default RoomForm;