import { useEffect, useMemo, useState } from "react";
import { GET } from "../../utils/api";

function AllWorkers() {

  const [workers, setWorkers] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // 🔍 SEARCH
  const [search, setSearch] =
    useState("");

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

        console.error(
          "Workers fetch error:",
          err
        );

        setError(
          err.message ||
          "Failed to fetch workers"
        );

      } finally {

        setLoading(false);

      }

    };

    fetchWorkers();

  }, []);

  // =========================
  // 🔎 FILTERED
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

        );

      });

    }, [workers, search]);

  // =========================
  // ⏳ LOADING
  // =========================
  if (loading) {

    return (
      <div className="
        flex
        justify-center
        items-center
        min-h-[300px]
        text-lg
      ">
        Loading workers...
      </div>
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
      rounded-3xl
      shadow-xl
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

        <div>

          <h2 className="
            text-3xl
            font-bold
            text-gray-800
            dark:text-white
          ">
            All Workers
          </h2>

          <p className="
            text-sm
            text-gray-500
            mt-1
          ">
            Total Workers:
            {" "}
            {filteredWorkers.length}
          </p>

        </div>

        {/* 🔍 SEARCH */}
        <input
          type="text"
          placeholder="Search workers..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="
            border
            dark:border-gray-700
            dark:bg-gray-800
            dark:text-white
            p-3
            rounded-2xl
            w-full
            md:w-80
            outline-none
            focus:ring-2
            focus:ring-blue-500
          "
        />

      </div>

      {/* ========================= */}
      {/* 📋 TABLE */}
      {/* ========================= */}

      <div className="
        overflow-x-auto
      ">

        <table className="
          w-full
          text-left
          border-collapse
        ">

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

            </tr>

          </thead>

          <tbody>

            {filteredWorkers.length === 0 ? (

              <tr>

                <td
                  colSpan="7"
                  className="
                    p-6
                    text-center
                    text-gray-500
                  "
                >
                  No workers found
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

                    {/* 👤 NAME */}
                    <td className="
                      p-4
                      font-medium
                    ">
                      {worker.name}
                    </td>

                    {/* 🏢 COMPANY */}
                    <td className="
                      p-4
                    ">
                      {worker.company || "N/A"}
                    </td>

                    {/* 🏕 CAMP */}
                    <td className="
                      p-4
                    ">
                      {worker.camp_name ||
                        "Unassigned"}
                    </td>

                    {/* 📅 JOIN DATE */}
                    <td className="
                      p-4
                    ">
                      {worker.join_date ||
                        "-"}
                    </td>

                    {/* 📅 END DATE */}
                    <td className="
                      p-4
                    ">
                      {worker.end_date ||
                        "Active"}
                    </td>

                    {/* 🍽 MESS */}
                    <td className="
                      p-4
                    ">

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

                    {/* 🟢 STATUS */}
                    <td className="
                      p-4
                    ">

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

                  </tr>

                );

              })

            )}

          </tbody>

        </table>

      </div>

    </div>

  );

}

export default AllWorkers;