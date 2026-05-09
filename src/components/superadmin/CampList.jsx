import { useEffect, useMemo, useState } from "react";
import { GET, DELETE } from "../../utils/api";

function CampList() {
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔍 SEARCH
  const [search, setSearch] = useState("");

  // =========================
  // 🔄 FETCH
  // =========================
  useEffect(() => {
    const fetchCamps = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await GET("/camps");

        setCamps(data || []);

      } catch (err) {
        console.error("Camp fetch error:", err);
        setError(err.message || "Failed to load camps");
      } finally {
        setLoading(false);
      }
    };

    fetchCamps();
  }, []);

  // =========================
  // 🔎 FILTERED CAMPS
  // =========================
  const filteredCamps = useMemo(() => {
    return camps.filter((camp) => {
      const text = search.toLowerCase();

      return (
        camp.name?.toLowerCase().includes(text) ||
        camp.location?.toLowerCase().includes(text)
      );
    });
  }, [camps, search]);

  // =========================
  // 🗑️ DELETE
  // =========================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this camp?"
    );

    if (!confirmDelete) return;

    try {
      await DELETE(`/camps/${id}`);

      // ✅ Instant UI update
      setCamps((prev) =>
        prev.filter((camp) => camp.id !== id)
      );

    } catch (err) {
      console.error("Delete error:", err);
      alert(err.message || "Delete failed");
    }
  };

  // =========================
  // ⏳ LOADING
  // =========================
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px] text-lg">
        Loading camps...
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

  return (
    <div className="space-y-6">

      {/* ========================= */}
      {/* 🔝 HEADER */}
      {/* ========================= */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Camp Management
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Total Camps: {filteredCamps.length}
          </p>
        </div>

        {/* 🔍 SEARCH */}
        <input
          type="text"
          placeholder="Search camps..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border dark:border-gray-700 dark:bg-gray-800 dark:text-white p-3 rounded-xl w-full md:w-80 outline-none focus:ring-2 focus:ring-blue-500"
        />

      </div>

      {/* ========================= */}
      {/* 🏕️ CAMPS GRID */}
      {/* ========================= */}

      {filteredCamps.length === 0 ? (

        <div className="bg-yellow-100 text-yellow-700 p-6 rounded-2xl text-center">
          No camps found
        </div>

      ) : (

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

          {filteredCamps.map((camp) => {

            const workerCount = Number(camp.workers || 0);

            return (
              <div
                key={camp.id}
                className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow hover:shadow-xl transition duration-300 border dark:border-gray-800"
              >

                {/* 🏕️ TITLE */}
                <div className="space-y-1">

                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                    {camp.name}
                  </h2>

                  <p className="text-sm text-gray-500">
                    📍 {camp.location}
                  </p>

                </div>

                {/* 📊 STATS */}
                <div className="mt-5 flex items-center justify-between">

                  <div>
                    <p className="text-xs text-gray-400 uppercase">
                      Workers
                    </p>

                    <p className="text-2xl font-bold text-blue-600">
                      {workerCount}
                    </p>
                  </div>

                  <div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        workerCount > 0
                          ? "bg-green-100 text-green-600"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {workerCount > 0
                        ? "Active"
                        : "Empty"}
                    </span>

                  </div>

                </div>

                {/* 🗑️ ACTIONS */}
                <div className="mt-6">

                  <button
                    onClick={() => handleDelete(camp.id)}
                    className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl transition font-medium"
                  >
                    Delete Camp
                  </button>

                </div>

              </div>
            );
          })}

        </div>

      )}

    </div>
  );
}

export default CampList;