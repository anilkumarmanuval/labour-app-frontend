import {
  FileSpreadsheet,
  Bed,
  Utensils,
  ClipboardCheck
} from "lucide-react";

const BASE_URL =
"http://localhost:5000";

function Reports() {

  const token =
    localStorage.getItem(
      "token"
    );

  const downloadReport =
    async (url, filename) => {

    try {

      const res =
        await fetch(
          `${BASE_URL}${url}`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );

      const blob =
        await res.blob();

      const link =
        document.createElement("a");

      link.href =
        window.URL.createObjectURL(blob);

      link.download =
        filename;

      link.click();

    } catch (err) {

      console.error(err);

      alert(
        "Download failed"
      );

    }

  };

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

      action: () =>
        downloadReport(
          "/report/attendance",
          "attendance.xlsx"
        )
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

      action: () =>
        downloadReport(
          "/report/mess",
          "mess.xlsx"
        )
    },

    {
      title:
        "Room Report",

      description:
        "Room occupancy export",

      icon:
        Bed,

      color:
        "bg-purple-500",

      action: () =>
        downloadReport(
          "/report/rooms",
          "rooms.xlsx"
        )
    }

  ];

  return (

    <div className="
      p-6
      space-y-6
    ">

      {/* HEADER */}

      <div>

        <h1 className="
          text-3xl
          font-bold
        ">
          Reports
        </h1>

        <p className="
          text-gray-500
          mt-1
        ">
          Export operational reports
        </p>

      </div>

      {/* REPORT GRID */}

      <div className="
        grid
        grid-cols-1
        md:grid-cols-2
        lg:grid-cols-3
        gap-6
      ">

        {reports.map((report) => {

          const Icon =
            report.icon;

          return (

            <div
              key={report.title}
              className="
                bg-white
                rounded-2xl
                shadow-lg
                p-6
                border
                border-gray-100
              "
            >

              {/* ICON */}

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

              {/* CONTENT */}

              <h2 className="
                text-xl
                font-bold
              ">
                {report.title}
              </h2>

              <p className="
                text-gray-500
                mt-2
                text-sm
              ">
                {report.description}
              </p>

              {/* BUTTON */}

              <button
                onClick={
                  report.action
                }
                className="
                  mt-6
                  w-full
                  bg-black
                  text-white
                  py-3
                  rounded-xl
                  hover:bg-gray-800
                  transition
                  flex
                  items-center
                  justify-center
                  gap-2
                "
              >

                <FileSpreadsheet
                  size={18}
                />

                Download Report

              </button>

            </div>

          );

        })}

      </div>

    </div>

  );

}

export default Reports;