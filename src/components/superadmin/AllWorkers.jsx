import { useEffect, useMemo, useState} from "react";
import { GET, DELETE, PUT} from "../../utils/api";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button} from "@mui/material";

function AllWorkers() {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // 🔍 SEARCH
  const [search, setSearch] = useState("");
  // ✏️ EDIT MODAL
  const [openEdit, setOpenEdit] = useState(false);
  const [editWorker, setEditWorker] = useState(null);

  // =========================
  // 🔄 FETCH
  // =========================

  useEffect(() => {
    const fetchWorkers =
      async () => {
      try {
        setLoading(true);
        setError("");
        const data =
          await GET("/all-workers");
        setWorkers(data || []);
      } catch (err) {
        console.error( "Workers fetch error:", err);
        setError( err.message || "Failed to fetch workers" );
      } finally {
        setLoading(false);
      }
    };
    fetchWorkers();
  }, []);

  // =========================
  // ✏️ EDIT
  // =========================

  const handleEdit = (
    worker
  ) => {
    setEditWorker(worker);
    setOpenEdit(true);
  };

  // =========================
  // 💾 UPDATE
  // =========================

  const handleUpdate =
    async () => {
    try {
      await PUT( `/workers/${editWorker.id}`, editWorker);
      setWorkers((prev) =>
        prev.map((worker) =>
          worker.id ===
          editWorker.id
            ? editWorker
            : worker
        )
      );
      setOpenEdit(false);
    } catch (err) {
      alert(
        err.message ||
        "Update failed"
      );
    }
  };

  // =========================
  // 🗑 DELETE
  // =========================

  const handleDelete =
    async (id) => {
    const confirmDelete = window.confirm( "Delete this employee?" );
    if (!confirmDelete) return;
    try {
      await DELETE( `/workers/${id}` );
      setWorkers((prev) => prev.filter( (worker) => worker.id !== id )
      );
    } catch (err) {
      alert(
        err.message ||
        "Delete failed"
      );
    }
  };

  // =========================
  // 🔎 FILTER
  // =========================

  const filteredWorkers =
    useMemo(() => {
      return workers.filter(
        (worker) => {
        const text =
          search.toLowerCase();
        return (
          worker.name
            ?.toLowerCase()
            .includes(text)
          ||
          worker.company
            ?.toLowerCase()
            .includes(text)
          ||
          worker.camp_name
            ?.toLowerCase()
            .includes(text)
          ||
          worker.employee_type
            ?.toLowerCase()
            .includes(text)
          ||
          worker.worker_id
            ?.toLowerCase()
            .includes(text)
        );
      });
    }, [workers, search]);
  // =========================
  // ⏳ LOADING
  // =========================

  if (loading) {
    return (
      <div className=" flex justify-center items-center min-h-[300px] text-lg font-medium "> Loading employees... </div>
    );
  }

  // =========================
  // ❌ ERROR
  // =========================

  if (error) {

    return (
      <div className="
        bg-red-100
        text-red-600
        p-4
        rounded-xl
      ">
        {error}
      </div>
    );

  }

  return (

    <div className="
      bg-white
      dark:bg-gray-900
      p-6
      rounded-2xl
      shadow-lg
      border
      border-gray-100
      space-y-6
    ">

      {/* ========================= */}
      {/* 🔝 HEADER */}
      {/* ========================= */}

      <div className="
        flex
        flex-col
        md:flex-row
        md:items-center
        md:justify-between
        gap-4
      ">

        {/* LEFT */}

        <div>

          <h2 className="
            text-3xl
            font-bold
            text-gray-800
            dark:text-white
          ">
            Employee Management
          </h2>

          <p className="
            text-sm
            text-gray-500
            mt-1
          ">
            Total Employees:
            {" "}
            {filteredWorkers.length}
          </p>

        </div>

        {/* RIGHT */}

        <div className="
          flex
          gap-3
          items-center
        ">

          {/* SEARCH */}

          <input
            type="text"
            placeholder="Search employees..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            className="
              border
              border-gray-200
              dark:border-gray-700
              dark:bg-gray-800
              dark:text-white
              px-4
              py-3
              rounded-xl
              w-full
              md:w-80
              outline-none
              focus:ring-2
              focus:ring-blue-500
              bg-gray-50
            "
          />

          {/* ADD BUTTON */}



        </div>

      </div>

      {/* ========================= */}
      {/* 📋 TABLE */}
      {/* ========================= */}

      <div className="
        overflow-x-auto
        rounded-2xl
        border
        border-gray-100
      ">

        <table className="
          w-full
          text-left
          border-collapse
        ">

          {/* TABLE HEAD */}

          <thead>

            <tr className="
              border-b
              dark:border-gray-700
              bg-gray-50
              dark:bg-gray-800
            ">

              <th className="
                p-4
                text-sm
                font-semibold
              ">
                Employee ID
              </th>

              <th className="
                p-4
                text-sm
                font-semibold
              ">
                Name
              </th>

              <th className="
                p-4
                text-sm
                font-semibold
              ">
                Company
              </th>

              <th className="
                p-4
                text-sm
                font-semibold
              ">
                Type
              </th>

              <th className="
                p-4
                text-sm
                font-semibold
              ">
                Camp
              </th>

              <th className="
                p-4
                text-sm
                font-semibold
              ">
                Join Date
              </th>

              <th className="
                p-4
                text-sm
                font-semibold
              ">
                End Date
              </th>

              <th className="
                p-4
                text-sm
                font-semibold
              ">
                Mess
              </th>

              <th className="
                p-4
                text-sm
                font-semibold
              ">
                Status
              </th>

              <th className="
                p-4
                text-sm
                font-semibold
              ">
                Actions
              </th>

            </tr>

          </thead>

          {/* TABLE BODY */}

          <tbody>

            {filteredWorkers.length === 0 ? (

              <tr>

                <td
                  colSpan="10"
                  className="
                    p-6
                    text-center
                    text-gray-500
                  "
                >
                  No employees found
                </td>

              </tr>

            ) : (

              filteredWorkers.map(
                (worker) => {

                const active =
                  !!worker.camp_name;

                return (

                  <tr
                    key={worker.id}
                    className="
                      border-b
                      dark:border-gray-800
                      hover:bg-gray-50
                      dark:hover:bg-gray-800
                      transition
                    "
                  >

                    {/* EMPLOYEE ID */}

                    <td className="
                      p-4
                      font-medium
                    ">
                      {worker.worker_id || "-"}
                    </td>

                    {/* NAME */}

                    <td className="
                      p-4
                      font-medium
                    ">
                      {worker.name}
                    </td>

                    {/* COMPANY */}

                    <td className="p-4">
                      {worker.company || "N/A"}
                    </td>

                    {/* TYPE */}

                    <td className="p-4">

                      <span
                        className={`
                          px-3
                          py-1
                          rounded-full
                          text-xs
                          font-medium
                          ${
                            worker.employee_type === "staff"
                              ? "bg-blue-100 text-blue-700"
                              : worker.employee_type === "visitor"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-orange-100 text-orange-700"
                          }
                        `}
                      >

                        {worker.employee_type || "Staff"}

                      </span>

                    </td>

                    {/* CAMP */}

                    <td className="p-4">
                      {worker.camp_name ||
                        "Main Camp"}
                    </td>

                    {/* JOIN DATE */}

                    <td className="p-4">
                      {worker.join_date || "-"}
                    </td>

                    {/* END DATE */}

                    <td className="p-4">
                      {worker.end_date || "Active"}
                    </td>

                    {/* MESS */}

                    <td className="p-4">

                      <span
                        className={`
                          px-3
                          py-1
                          rounded-full
                          text-xs
                          font-medium
                          ${
                            worker.mess === "Yes"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-200 text-gray-600"
                          }
                        `}
                      >

                        {worker.mess || "No"}

                      </span>

                    </td>

                    {/* STATUS */}

                    <td className="p-4">

                      <span
                        className={`
                          px-3
                          py-1
                          rounded-full
                          text-xs
                          font-medium
                          ${
                            active
                              ? "bg-green-100 text-green-600"
                              : "bg-yellow-100 text-yellow-700"
                          }
                        `}
                      >

                        {active
                          ? "Active"
                          : "Pending"}

                      </span>

                    </td>

                    {/* ACTIONS */}

                    <td className="p-4">

                      <div className="
                        flex
                        gap-2
                      ">

                        {/* EDIT */}

                        <button
                          onClick={() =>
                            handleEdit(
                              worker
                            )
                          }
                          className="
                            px-3
                            py-1
                            text-xs
                            rounded-lg
                            bg-blue-100
                            text-blue-700
                            hover:bg-blue-200
                            transition
                          "
                        >
                          Edit
                        </button>

                        {/* DELETE */}

                        <button
                          onClick={() =>
                            handleDelete(
                              worker.id
                            )
                          }
                          className="
                            px-3
                            py-1
                            text-xs
                            rounded-lg
                            bg-red-100
                            text-red-700
                            hover:bg-red-200
                            transition
                          "
                        >
                          Delete
                        </button>

                      </div>

                    </td>

                  </tr>

                );

              })

            )}

          </tbody>

        </table>

      </div>

      {/* ========================= */}
      {/* ✏️ EDIT MODAL */}
      {/* ========================= */}

      <Dialog
  open={openEdit}
  onClose={() =>
    setOpenEdit(false)
  }
  disableRestoreFocus
  maxWidth="sm"
  fullWidth
>

        <DialogTitle>
          Edit Employee
        </DialogTitle>

        <DialogContent
          className="
            flex
            flex-col
            gap-4
            pt-4
          "
        >

          <TextField
            label="Name"
            value={
              editWorker?.name || ""
            }
            onChange={(e) =>
              setEditWorker({
                ...editWorker,
                name:
                  e.target.value
              })
            }
          />

          <TextField
            label="Company"
            value={
              editWorker?.company ||
              ""
            }
            onChange={(e) =>
              setEditWorker({
                ...editWorker,
                company:
                  e.target.value
              })
            }
          />

          <TextField
            label="Mobile"
            value={
              editWorker?.mobile ||
              ""
            }
            onChange={(e) =>
              setEditWorker({
                ...editWorker,
                mobile:
                  e.target.value
              })
            }
          />

          <TextField
  label="Join Date"
  type="date"
  slotProps={{
    inputLabel: {
      shrink: true
    }
  }}
            value={
              editWorker?.join_date ||
              ""
            }
            onChange={(e) =>
              setEditWorker({
                ...editWorker,
                join_date:
                  e.target.value
              })
            }
          />

          <TextField
            label="End Date"
            type="date"
           slotProps={{
    inputLabel: {
      shrink: true
    }
  }}
            value={
              editWorker?.end_date ||
              ""
            }
            onChange={(e) =>
              setEditWorker({
                ...editWorker,
                end_date:
                  e.target.value
              })
            }
          />

        </DialogContent>

        <DialogActions>

          <Button
            onClick={() =>
              setOpenEdit(false)
            }
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleUpdate}
          >
            Save Changes
          </Button>

        </DialogActions>

      </Dialog>

    </div>

  );

}

export default AllWorkers;