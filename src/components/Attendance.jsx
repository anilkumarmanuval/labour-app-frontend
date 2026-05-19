import { useEffect, useState} from "react";
import { GET, POST} from "../utils/api";

function Attendance({ campId }) {
  const [workers, setWorkers] =
    useState([]);
  const [liveLogs, setLiveLogs] =
    useState([]);
  const [loading, setLoading] =
    useState(true);
  const [error, setError] =
    useState(null);
  let user = null;

  try {
    user =
      JSON.parse(
        localStorage.getItem("user")
      );
  } catch {
    user = null;
  }

  // =========================
  // FETCH MANUAL ATTENDANCE
  // =========================

  const fetchAttendance =
    async () => {

      try {

        if (!campId) return;

        const data =
          await GET(
            `/attendance?camp_id=${campId}`
          );

        setWorkers(data);

      } catch (err) {

        console.error(err);

        setError(err.message);

      }

    };

  // =========================
  // FETCH LIVE BIOMETRIC LOGS
  // =========================

  const fetchLiveLogs =
    async () => {

      try {

        const data =
          await GET(
            "/attendance/live"
          );

        setLiveLogs(data);

      } catch (err) {

        console.error(err);

      }

    };

  // =========================
  // INITIAL LOAD
  // =========================

  useEffect(() => {

    const loadData =
      async () => {

        setLoading(true);

        await fetchAttendance();

        await fetchLiveLogs();

        setLoading(false);

      };

    loadData();

    // AUTO REFRESH
    const interval =
      setInterval(() => {

        fetchLiveLogs();

      }, 5000);

    return () =>
      clearInterval(interval);

  }, [campId]);

  // =========================
  // MARK MANUAL ATTENDANCE
  // =========================

  const mark =
    async (id, status) => {

      try {

        await POST(
          "/attendance",
          {
            worker_id: id,
            status
          }
        );

        fetchAttendance();

      } catch (err) {

        alert(err.message);

      }

    };

  // =========================
  // DOWNLOAD REPORTS
  // =========================

  const download =
    async (url, name) => {

      try {

        if (!campId)
          return alert(
            "Camp ID missing"
          );

        const res =
          await fetch(
            `http://localhost:5000${url}`,
            {
              headers: {
                Authorization:
                  `Bearer ${localStorage.getItem("token")}`
              }
            }
          );

        if (!res.ok)
          throw new Error(
            "Download failed"
          );

        const blob =
          await res.blob();

        const a =
          document.createElement("a");

        a.href =
          URL.createObjectURL(blob);

        a.download = name;

        a.click();

      } catch (err) {

        alert(err.message);

      }

    };

  // =========================
  // LOADING
  // =========================

  if (loading) {

    return (
      <div className="
        p-8
        text-lg
      ">
        Loading attendance...
      </div>
    );

  }

  // =========================
  // ERROR
  // =========================

  if (error) {

    return (
      <div className="
        p-8
        text-red-500
      ">
        {error}
      </div>
    );

  }

  return (

    <div className="
      p-8
      space-y-8
    ">

      {/* HEADER */}

      <div className="
        flex
        justify-between
        items-center
      ">

        <h1 className="
          text-3xl
          font-bold
        ">
          Attendance
        </h1>

        {user?.role ===
          "superadmin" && (

          <div className="
            space-x-2
          ">

            <button
              onClick={() =>
                download(
                  `/report/attendance?camp_id=${campId}`,
                  "attendance.xlsx"
                )
              }
              className="
                bg-blue-600
                text-white
                px-4
                py-2
                rounded
              "
            >
              Excel
            </button>

            <button
              onClick={() =>
                download(
                  `/report/attendance/pdf?camp_id=${campId}`,
                  "attendance.pdf"
                )
              }
              className="
                bg-purple-600
                text-white
                px-4
                py-2
                rounded
              "
            >
              PDF
            </button>

          </div>

        )}

      </div>

{/* MANUAL ATTENDANCE OVERRIDE */}

<div>

  <div
    className="
      flex
      justify-between
      items-center
      mb-4
    "
  >

    <div>

      <h2
        className="
          text-xl
          font-semibold
        "
      >
        Manual Attendance Override
      </h2>

      <p
        className="
          text-sm
          text-gray-500
          mt-1
        "
      >
        Used for missed punches or corrections
      </p>

    </div>

    <button
      onClick={() => {

        const workerId =
          prompt(
            "Enter Employee ID"
          );

        if (!workerId) return;

        const worker =
          workers.find(
            (w) =>
              w.worker_id === workerId
          );

        if (!worker) {

          alert(
            "Worker not found"
          );

          return;
        }

        const type =
          prompt(
            "Enter:\nIN\nOUT"
          );

        if (!type) return;

        if (
          type.toUpperCase() === "IN"
        ) {

          mark(
            worker.id,
            "Present"
          );

        }

        else if (
          type.toUpperCase() === "OUT"
        ) {

          mark(
            worker.id,
            "Absent"
          );

        }

        else {

          alert(
            "Invalid Type"
          );

        }

      }}
      className="
        bg-orange-600
        hover:bg-orange-700
        text-white
        px-5
        py-3
        rounded-xl
        font-medium
      "
    >
      + Manual Attendance
    </button>

  </div>

  {/* SUMMARY CARDS */}

  <div
    className="
      grid
      grid-cols-1
      md:grid-cols-3
      gap-4
    "
  >

    {/* PRESENT */}

    <div
      className="
        bg-white
        rounded-2xl
        shadow
        p-5
      "
    >

      <div
        className="
          text-sm
          text-gray-500
        "
      >
        Present Today
      </div>

      <div
        className="
          text-3xl
          font-bold
          text-green-600
          mt-2
        "
      >
        {
          workers.filter(
            (w) =>
              w.status === "Present"
          ).length
        }
      </div>

    </div>

    {/* ABSENT */}

    <div
      className="
        bg-white
        rounded-2xl
        shadow
        p-5
      "
    >

      <div
        className="
          text-sm
          text-gray-500
        "
      >
        Absent Today
      </div>

      <div
        className="
          text-3xl
          font-bold
          text-red-600
          mt-2
        "
      >
        {
          workers.filter(
            (w) =>
              w.status === "Absent"
          ).length
        }
      </div>

    </div>

    {/* TOTAL */}

    <div
      className="
        bg-white
        rounded-2xl
        shadow
        p-5
      "
    >

      <div
        className="
          text-sm
          text-gray-500
        "
      >
        Total Workers
      </div>

      <div
        className="
          text-3xl
          font-bold
          text-blue-600
          mt-2
        "
      >
        {workers.length}
      </div>

    </div>

  </div>

</div>

{/* LIVE BIOMETRIC ATTENDANCE */}

<div>

  <div className="
    flex
    justify-between
    items-center
    mb-4
  ">

    <h2 className="
      text-xl
      font-semibold
    ">
      Live Biometric Attendance
    </h2>

    <div className="
      text-sm
      text-green-600
      font-medium
    ">
      Live Updates Every 5 Seconds
    </div>

  </div>

  <div className="
    bg-white
    rounded-2xl
    shadow
    overflow-hidden
  ">

    <table className="
      w-full
    ">

      <thead className="
        bg-gray-100
      ">

        <tr>

          <th className="
            text-left
            p-4
            font-semibold
          ">
            Employee
          </th>

          <th className="
            text-left
            p-4
            font-semibold
          ">
            Employee ID
          </th>

          <th className="
            text-left
            p-4
            font-semibold
          ">
            Company
          </th>

          <th className="
            text-left
            p-4
            font-semibold
          ">
            Punch Time
          </th>

          <th className="
            text-left
            p-4
            font-semibold
          ">
            Method
          </th>

        </tr>

      </thead>

      <tbody>

        {liveLogs.length === 0 ? (

          <tr>

            <td
              colSpan="5"
              className="
                p-6
                text-center
                text-gray-500
              "
            >
              No biometric logs yet
            </td>

          </tr>

        ) : (

          liveLogs.map((log) => (

            <tr
              key={log.id}
              className="
                border-t
                hover:bg-gray-50
              "
            >

              {/* EMPLOYEE */}

              <td className="
                p-4
                font-medium
              ">

                {
                  log.name ||
                  "Unknown Worker"
                }

              </td>

              {/* EMPLOYEE ID */}

              <td className="
                p-4
              ">

                {
                  log.worker_id ||
                  "-"
                }

              </td>

              {/* COMPANY */}

              <td className="
                p-4
              ">

                { log.company || "-" }
              </td>

              {/* TIME */}

              <td className=" p-4">
                {
                  new Date(
                    log.punch_time
                  ).toLocaleString()
                }
              </td>

              {/* METHOD */}

              <td className=" p-4 ">
                <span className={`
                  px-3
                  py-1
                  rounded-full
                  text-sm
                  font-medium

                  ${
                    log.verify_type === 15
                      ? "bg-blue-100 text-blue-700"
                      : log.verify_type === 1
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }
                `}>
                  {
                    log.verify_type === 15
                      ? "Face"
                      : log.verify_type === 1
                      ? "Fingerprint"
                      : "Other"
                  }
                </span>
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
}

export default Attendance;