import React, { useEffect, useState } from "react";
import { GET, POST, DELETE, PUT } from "../../utils/api";

const CardManagement = () => {
  const [workers, setWorkers] = useState([]);
  const [cards, setCards] = useState([]);
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    worker_id: "",
    card_uid: "",
    card_type: "RFID",
    status: "Active",
  });

  // FETCH WORKERS
  const fetchWorkers = async () => {
    try {
const data = await GET("/all-workers");
      setWorkers(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  // FETCH CARDS
  const fetchCards = async () => {
    try {
      const data = await GET("/cards");
      setCards(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchWorkers();
    fetchCards();
  }, []);

  // HANDLE INPUT
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // SAVE CARD
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.card_uid.trim()) {
      alert("Card UID required");
      return;
    }

    try {
      await POST("/cards", formData);
      alert("Card added successfully");
      setFormData({
        worker_id: "",
        card_uid: "",
        card_type: "RFID",
        status: "Active",
      });
      fetchCards();
    } catch (err) {
      console.error(err);
      alert("Failed to add card");
    }
  };

  // DELETE CARD
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this card?")) return;

    try {
      await DELETE(`/cards/${id}`);
      fetchCards();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  // REPLACE CARD
  const handleReplace = async (card) => {
    const newUID = prompt("Enter New Card UID");

    if (!newUID) return;

    try {
      // disable old card
      await PUT(`/cards/${card.id}`, {
        status: "Disabled",
      });

      // create new card
      await POST("/cards", {
        worker_id: card.worker_id,
        card_uid: newUID,
        card_type: card.card_type,
        status: "Active",
      });

      alert("Card replaced successfully");
      fetchCards();
    } catch (err) {
      console.error(err);
      alert("Replace failed");
    }
  };

  // FILTERED CARDS
  const filteredCards = cards.filter((card) =>
    `${card.worker_name} ${card.card_uid}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8 bg-gray-50 min-h-screen font-sans">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
            Card Management
          </h1>
          <p className="text-gray-500 mt-1 text-sm md:text-base">
            Manage and provision RFID & NFC access cards
          </p>
        </div>
      </div>

      {/* FORM CARD */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-8 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-6 tracking-tight">
          Provision New Card
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* CARD UID */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-500">
                Card UID
              </label>
              <input
                type="text"
                name="card_uid"
                value={formData.card_uid}
                onChange={handleChange}
                placeholder="Enter Card UID"
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-gray-900 placeholder:text-gray-400 transition-all outline-none hover:border-gray-300 focus:border-gray-900 focus:bg-white focus:ring-1 focus:ring-gray-900"
                required
              />
            </div>

            {/* WORKER */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-500">
                Worker
              </label>
              <select
                name="worker_id"
                value={formData.worker_id}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-gray-900 transition-all outline-none hover:border-gray-300 focus:border-gray-900 focus:bg-white focus:ring-1 focus:ring-gray-900"
                required
              >
                <option value="">Select Worker</option>
                {workers.map((worker) => (
                  <option key={worker.id} value={worker.id}>
                    {worker.name}
                  </option>
                ))}
              </select>
            </div>

            {/* CARD TYPE */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-500">
                Card Type
              </label>
              <select
                name="card_type"
                value={formData.card_type}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-gray-900 transition-all outline-none hover:border-gray-300 focus:border-gray-900 focus:bg-white focus:ring-1 focus:ring-gray-900"
              >
                <option value="RFID">RFID</option>
                <option value="NFC">NFC</option>
              </select>
            </div>

            {/* STATUS */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-500">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-gray-900 transition-all outline-none hover:border-gray-300 focus:border-gray-900 focus:bg-white focus:ring-1 focus:ring-gray-900"
              >
                <option value="Active">Active</option>
                <option value="Disabled">Disabled</option>
              </select>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="mt-8 flex flex-wrap justify-end gap-3 border-t border-gray-100 pt-6">
            <button
              type="button"
              onClick={() => alert("Scanner integration later")}
              className="rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
            >
              Scan Card
            </button>
            <button
              type="submit"
              className="rounded-xl bg-gray-900 px-6 py-3 text-sm font-medium text-white transition-all hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 shadow-sm"
            >
              Save Card
            </button>
          </div>
        </form>
      </div>

      {/* TABLE CARD */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        
        {/* TABLE HEADER / CONTROLS */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between p-6 md:p-8 border-b border-gray-100 gap-4">
          <h2 className="text-lg font-semibold text-gray-900 tracking-tight">
            Active Directory
          </h2>
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search worker or UID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 transition-all outline-none hover:border-gray-300 focus:border-gray-900 focus:bg-white focus:ring-1 focus:ring-gray-900"
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-200">
                <th className="px-6 py-4 font-medium text-gray-500">Worker</th>
                <th className="px-6 py-4 font-medium text-gray-500">Card UID</th>
                <th className="px-6 py-4 font-medium text-gray-500">Type</th>
                <th className="px-6 py-4 font-medium text-gray-500">Status</th>
                <th className="px-6 py-4 font-medium text-gray-500">Issued At</th>
                <th className="px-6 py-4 font-medium text-gray-500 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredCards.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    No cards found matching your search.
                  </td>
                </tr>
              ) : (
                filteredCards.map((card) => (
                  <tr key={card.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {card.worker_name}
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-mono text-xs">
                      {card.card_uid}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {card.card_type}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                          card.status === "Active"
                            ? "bg-gray-900 text-white border-gray-900"
                            : "bg-gray-100 text-gray-500 border-gray-200"
                        }`}
                      >
                        {card.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(card.issued_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleReplace(card)}
                          className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-1"
                        >
                          Replace
                        </button>
                        <button
                          onClick={() => handleDelete(card.id)}
                          className="px-3 py-1.5 text-xs font-medium text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-1"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CardManagement;