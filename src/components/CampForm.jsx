import { useState } from "react";
import { POST } from "../utils/api"; // ✅ API

function CampForm() {
  const [form, setForm] = useState({
    name: "",
    location: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // =========================
  // 🏕️ CREATE CAMP
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.location.trim()) {
      return alert("All fields are required");
    }

    setLoading(true);

    try {
      await POST("/camps", form);

      alert("Camp created successfully!");
      setForm({ name: "", location: "" });

    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">

      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Create Camp
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="text"
          name="name"
          placeholder="Camp Name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
        />

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full p-3 rounded-lg text-white font-semibold ${
            loading
              ? "bg-gray-500"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Creating..." : "Create Camp"}
        </button>

      </form>

    </div>
  );
}

export default CampForm;