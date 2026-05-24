import React, {
  useEffect,
  useState
} from "react";

import {
  FileSpreadsheet,
  Bed,
  Utensils,
  ClipboardCheck,
  Eye,
  Search
} from "lucide-react";

import {
  GET
} from "../../utils/api";

import {
  useAuth
} from "../../context/AuthContext";

const BASE_URL =
"http://localhost:5000";

function Reports() {

  const token =
    localStorage.getItem("token");

  // =====================================
  // AUTH
  // =====================================

  const { user } =
    useAuth();

  const role =
    user?.role;

  // =====================================
  // SUPER ADMIN ONLY
  // =====================================

  if (
    role !== "superadmin"
  ) {

    return (

      <div className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-gray-50
      ">

        <div className="
          bg-white
          p-10
          rounded-3xl
          shadow-sm
          border
          text-center
        ">

          <h1 className="
            text-3xl
            font-bold
            text-red-500
          ">
            Access Denied
          </h1>

          <p className="
            text-gray-500
            mt-3
          ">
            Reports are available only for Super Admin.
          </p>

        </div>

      </div>

    );

  }

  // =====================================
  // FILTERS
  // =====================================

  const [fromDate,
    setFromDate] =
    useState("");

  const [toDate,
    setToDate] =
    useState("");

  // =====================================
  // WORKERS
  // =====================================

  const [workers,
    setWorkers] =
    useState([]);

  const [workerSearch,
    setWorkerSearch] =
    useState("");

  const [showWorkerModal,
    setShowWorkerModal] =
    useState(false);

  const [selectedWorker,
    setSelectedWorker] =
    useState(null);

  // =====================================
  // COMPANY FILTER
  // =====================================

  const [company,
    setCompany] =
    useState("");

  // =====================================
  // PREVIEW
  // =====================================

  const [previewTitle,
    setPreviewTitle] =
    useState("");

  const [previewData,
    setPreviewData] =
    useState([]);

  const [loading,
    setLoading] =
    useState(false);

  // =====================================
  // FETCH WORKERS
  // =====================================

  useEffect(() => {

    fetchWorkers();

  }, []);

  const fetchWorkers =
    async () => {

    try {

      // ✅ FIXED

      const data =
        await GET(
          "/all-workers"
        );

      setWorkers(
        data || []
      );

    } catch (err) {

      console.error(err);

    }

  };

  // =====================================
  // FILTER WORKERS
  // =====================================

  const filteredWorkers =
    workers.filter((w) =>
      `${w.name} ${w.id}`
        .toLowerCase()
        .includes(
          workerSearch.toLowerCase()
        )
    );

  // =====================================
  // UNIQUE COMPANIES
  // =====================================

  const companies =
    [...new Set(

      workers
        .map(
          (w) => w.company
        )
        .filter(Boolean)

    )];

  // =====================================
  // DOWNLOAD REPORT
  // =====================================

  const downloadReport =
    async (
      url,
      filename
    ) => {

    try {

      const res =
        await fetch(
          `${BASE_URL}${url}`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      if (!res.ok) {

        throw new Error(
          "Download failed"
        );

      }

      const blob =
        await res.blob();

      const link =
        document.createElement("a");

      const objectUrl =
        window.URL
        .createObjectURL(blob);

      link.href =
        objectUrl;

      link.download =
        filename;

      document.body
      .appendChild(link);

      link.click();

      document.body
      .removeChild(link);

      window.URL
      .revokeObjectURL(
        objectUrl
      );

    } catch (err) {

      console.error(err);

      alert(
        "Download failed"
      );

    }

  };

  // =====================================
  // PREVIEW REPORT
  // =====================================

  const previewReport =
    async (
      type
    ) => {

    setLoading(true);

    try {

      const query =
        `?from=${fromDate}&to=${toDate}&worker=${selectedWorker?.id || ""}&company=${company}`;

      const data =
        await GET(
          `/report-preview/${type}${query}`
        );

      setPreviewData(
        data || []
      );

      setPreviewTitle(
        type
      );

    } catch (err) {

      console.error(err);

      alert(
        "Preview failed"
      );

    } finally {

      setLoading(false);

    }

  };

  // =====================================
  // REPORT CONFIG
  // =====================================

  const reports = [

    {
      title:
        "Attendance Report",

      description:
        "Daily attendance export",

      icon:
        ClipboardCheck,

      color:
        "bg-blue-500",

      preview:
        () =>
          previewReport(
            "attendance"
          ),

      download:
        () =>
          downloadReport(
            `/report/attendance?from=${fromDate}&to=${toDate}&worker=${selectedWorker?.id || ""}&company=${company}`,
            "attendance.xlsx"
          ),
    },

    {
      title:
        "Mess Report",

      description:
        "Mess usage export",

      icon:
        Utensils,

      color:
        "bg-green-500",

      preview:
        () =>
          previewReport(
            "mess"
          ),

      download:
        () =>
          downloadReport(
            `/report/mess?from=${fromDate}&to=${toDate}&worker=${selectedWorker?.id || ""}&company=${company}`,
            "mess.xlsx"
          ),
    },

    {
      title:
        "Room Occupancy",

      description:
        "Room occupancy export",

      icon:
        Bed,

      color:
        "bg-purple-500",

      preview:
        () =>
          previewReport(
            "rooms"
          ),

      download:
        () =>
          downloadReport(
            `/report/rooms?from=${fromDate}&to=${toDate}&worker=${selectedWorker?.id || ""}&company=${company}`,
            "rooms.xlsx"
          ),
    },

  ];

  return (

    <div className="
      p-6
      space-y-6
      bg-gray-50
      min-h-screen
    ">

      {/* HEADER */}

      <div>

        <h1 className="
          text-3xl
          font-bold
          text-gray-900
        ">
          Reports
        </h1>

        <p className="
          text-gray-500
          mt-1
        ">
          Export and preview reports
        </p>

      </div>

      {/* FILTERS */}

      <div className="
        bg-white
        p-5
        rounded-3xl
        shadow-sm
        border
        border-gray-200
        grid
        grid-cols-1
        md:grid-cols-4
        gap-4
      ">

        {/* FROM */}

        <div>

          <label className="
            text-sm
            text-gray-500
            mb-1
            block
          ">
            From Date
          </label>

          <input
            type="date"
            value={fromDate}
            onChange={(e) =>
              setFromDate(
                e.target.value
              )
            }
            className="
              w-full
              border
              border-gray-300
              rounded-2xl
              px-4
              py-3
              outline-none
            "
          />

        </div>

        {/* TO */}

        <div>

          <label className="
            text-sm
            text-gray-500
            mb-1
            block
          ">
            To Date
          </label>

          <input
            type="date"
            value={toDate}
            onChange={(e) =>
              setToDate(
                e.target.value
              )
            }
            className="
              w-full
              border
              border-gray-300
              rounded-2xl
              px-4
              py-3
              outline-none
            "
          />

        </div>

        {/* WORKER FILTER */}

        <div>

          <label className="
            text-sm
            text-gray-500
            mb-1
            block
          ">
            Worker Filter
          </label>

          <button
            onClick={() =>
              setShowWorkerModal(true)
            }
            className="
              w-full
              border
              border-gray-300
              rounded-2xl
              px-4
              py-3
              bg-white
              text-left
            "
          >

            {
              selectedWorker

              ? `${selectedWorker.name} (#${selectedWorker.id})`

              : "Select Worker"
            }

          </button>

        </div>

        {/* COMPANY FILTER */}

        <div>

          <label className="
            text-sm
            text-gray-500
            mb-1
            block
          ">
            Company
          </label>

          <select
            value={company}
            onChange={(e) =>
              setCompany(
                e.target.value
              )
            }
            className="
              w-full
              border
              border-gray-300
              rounded-2xl
              px-4
              py-3
              outline-none
            "
          >

            <option value="">
              All Companies
            </option>

            {
              companies.map(
                (companyName) => (

                <option
                  key={companyName}
                  value={companyName}
                >
                  {companyName}
                </option>

              ))
            }

          </select>

        </div>

      </div>

      {/* REPORT CARDS */}

      <div className="
        grid
        grid-cols-1
        md:grid-cols-2
        lg:grid-cols-3
        gap-6
      ">

        {
          reports.map(
            (report) => {

            const Icon =
              report.icon;

            return (

              <div
                key={report.title}
                className="
                  bg-white
                  rounded-3xl
                  shadow-sm
                  border
                  border-gray-200
                  p-6
                  flex
                  flex-col
                "
              >

                <div className={`
                  w-14
                  h-14
                  rounded-2xl
                  flex
                  items-center
                  justify-center
                  text-white
                  mb-5
                  ${report.color}
                `}>

                  <Icon size={28} />

                </div>

                <div className="
                  flex-grow
                ">

                  <h2 className="
                    text-xl
                    font-bold
                  ">
                    {report.title}
                  </h2>

                  <p className="
                    text-gray-500
                    text-sm
                    mt-2
                  ">
                    {report.description}
                  </p>

                </div>

                <div className="
                  mt-6
                  flex
                  gap-3
                ">

                  <button
                    onClick={
                      report.preview
                    }
                    className="
                      flex-1
                      bg-gray-100
                      hover:bg-gray-200
                      py-3
                      rounded-2xl
                      flex
                      items-center
                      justify-center
                      gap-2
                    "
                  >

                    <Eye size={18} />

                    Preview

                  </button>

                  <button
                    onClick={
                      report.download
                    }
                    className="
                      flex-1
                      bg-black
                      hover:bg-gray-800
                      text-white
                      py-3
                      rounded-2xl
                      flex
                      items-center
                      justify-center
                      gap-2
                    "
                  >

                    <FileSpreadsheet
                      size={18}
                    />

                    Excel

                  </button>

                </div>

              </div>

            );

          })
        }

      </div>

      {/* PREVIEW */}

      {
        previewData.length > 0 && (

          <div className="
            bg-white
            rounded-3xl
            shadow-sm
            border
            border-gray-200
            p-6
          ">

            <h2 className="
              text-2xl
              font-bold
              capitalize
              mb-5
            ">
              {previewTitle}
              {" "}
              Preview
            </h2>

            <div className="
              overflow-auto
            ">

              <table className="
                w-full
              ">

                <thead>

                  <tr className="
                    bg-gray-100
                  ">

                    {
                      Object.keys(
                        previewData[0]
                      ).map(
                        (key) => (

                        <th
                          key={key}
                          className="
                            text-left
                            p-3
                            capitalize
                          "
                        >
                          {
                            key.replaceAll(
                              "_",
                              " "
                            )
                          }
                        </th>

                      ))
                    }

                  </tr>

                </thead>

                <tbody>

                  {
                    previewData.map(
                      (
                        row,
                        index
                      ) => (

                      <tr
                        key={index}
                        className="
                          border-b
                        "
                      >

                        {
                          Object.values(
                            row
                          ).map(
                            (
                              value,
                              i
                            ) => (

                            <td
                              key={i}
                              className="
                                p-3
                                text-sm
                              "
                            >

                              {
                                value
                                ? value.toString()
                                : "-"
                              }

                            </td>

                          ))
                        }

                      </tr>

                    ))
                  }

                </tbody>

              </table>

            </div>

          </div>

        )
      }

      {/* WORKER MODAL */}

      {
        showWorkerModal && (

          <div className="
            fixed
            inset-0
            bg-black/40
            flex
            items-center
            justify-center
            z-50
            p-4
          ">

            <div className="
              bg-white
              rounded-3xl
              w-full
              max-w-lg
              p-6
            ">

              {/* HEADER */}

              <div className="
                flex
                justify-between
                items-center
                mb-5
              ">

                <h2 className="
                  text-2xl
                  font-bold
                ">
                  Select Worker
                </h2>

                <button
                  onClick={() =>
                    setShowWorkerModal(false)
                  }
                  className="
                    text-xl
                  "
                >
                  ✕
                </button>

              </div>

              {/* SEARCH */}

              <div className="
                relative
                mb-5
              ">

                <Search
                  size={18}
                  className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-gray-400
                  "
                />

                <input
                  type="text"
                  placeholder="Search by ID or name..."
                  value={workerSearch}
                  onChange={(e) =>
                    setWorkerSearch(
                      e.target.value
                    )
                  }
                  className="
                    w-full
                    border
                    border-gray-300
                    rounded-2xl
                    pl-11
                    pr-4
                    py-3
                    outline-none
                  "
                />

              </div>

              {/* LIST */}

              <div className="
                max-h-[400px]
                overflow-y-auto
                space-y-2
              ">

                <button
                  onClick={() => {

                    setSelectedWorker(null);

                    setShowWorkerModal(false);

                  }}
                  className="
                    w-full
                    text-left
                    border
                    rounded-2xl
                    px-4
                    py-3
                    hover:bg-gray-100
                  "
                >
                  All Workers
                </button>

                {
                  filteredWorkers.map(
                    (worker) => (

                    <button
                      key={worker.id}
                      onClick={() => {

                        setSelectedWorker(worker);

                        setShowWorkerModal(false);

                      }}
                      className="
                        w-full
                        text-left
                        border
                        rounded-2xl
                        px-4
                        py-3
                        hover:bg-gray-100
                      "
                    >

                      <div className="
                        font-medium
                      ">
                        {worker.name}
                      </div>

                      <div className="
                        text-sm
                        text-gray-500
                      ">
                        Worker ID:
                        {" "}
                        {worker.id}
                      </div>

                    </button>

                  ))
                }

              </div>

            </div>

          </div>

        )
      }

      {/* LOADING */}

      {
        loading && (

          <div className="
            text-center
            text-gray-500
          ">
            Loading preview...
          </div>

        )
      }

    </div>

  );

}

export default Reports;