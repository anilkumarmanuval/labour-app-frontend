import { useEffect, useState } from "react";

import {
  GET,
  POST
} from "../utils/api";

function RoomForm() {

  const [rooms, setRooms] =
    useState([]);

  const [workers, setWorkers] =
    useState([]);

  const [beds, setBeds] =
    useState([]);

  const [selectedRoom, setSelectedRoom] =
    useState("");

  const [selectedWorker, setSelectedWorker] =
    useState("");

  const [error, setError] =
    useState(null);

  // =====================================
  // FETCH DATA
  // =====================================

  useEffect(() => {

    fetchRooms();
    fetchWorkers();

  }, []);

  // =====================================
  // FETCH ROOMS
  // =====================================

  const fetchRooms =
    async () => {

    try {

      const data =
        await GET("/rooms");

      setRooms(data);

    } catch (err) {

      setError(err.message);

    }

  };

  // =====================================
  // FETCH WORKERS
  // =====================================

  const fetchWorkers =
    async () => {

    try {

      const data =
        await GET(
          "/available-workers"
        );

      setWorkers(data);

    } catch (err) {

      setError(err.message);

    }

  };

  // =====================================
  // FETCH BEDS
  // =====================================

  const fetchBeds =
    async (roomId) => {

    try {

      const data =
        await GET(
          `/beds?room_id=${roomId}`
        );

      setBeds(data);

    } catch (err) {

      setError(err.message);

    }

  };

  // =====================================
  // ASSIGN BED
  // =====================================

  const handleAssign =
    async (bedId) => {

    if (!selectedWorker) {

      return alert(
        "Select worker first"
      );

    }

    try {

      // ✅ CORRECT ROUTE

      await POST(
        "/assign-bed",
        {
          bed_id: bedId,
          worker_id:
            selectedWorker
        }
      );

      // ✅ REFRESH

      await fetchBeds(
        selectedRoom
      );

      await fetchWorkers();

      // ✅ RESET

      setSelectedWorker("");

    } catch (err) {

      console.error(err);

      alert(
        err.message
      );

    }

  };

  // =====================================
  // REMOVE BED
  // =====================================

  const handleUnassign =
    async (bedId) => {

    try {

      // ✅ CORRECT ROUTE

      await POST(
        "/remove-bed",
        {
          bed_id: bedId
        }
      );

      // ✅ REFRESH

      await fetchBeds(
        selectedRoom
      );

      await fetchWorkers();

    } catch (err) {

      console.error(err);

      alert(
        err.message
      );

    }

  };

  // =====================================
  // ERROR UI
  // =====================================

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
          Room Allocation
        </h1>

        <p className="
          text-gray-500
          mt-1
        ">
          Assign employees to beds
        </p>

      </div>

      {/* TOP SECTION */}

      <div className="
        grid
        grid-cols-1
        md:grid-cols-2
        gap-6
      ">

        {/* ROOM SELECT */}

        <div className="
          bg-white
          p-6
          rounded-3xl
          shadow-sm
          border
          border-gray-200
        ">

          <h2 className="
            text-lg
            font-semibold
            mb-4
          ">
            Select Room
          </h2>

          <select
            value={selectedRoom}
            onChange={(e) => {

              setSelectedRoom(
                e.target.value
              );

              fetchBeds(
                e.target.value
              );

            }}
            className="
              border
              border-gray-300
              rounded-2xl
              p-3
              w-full
              outline-none
              focus:ring-2
              focus:ring-black
            "
          >

            <option value="">
              Choose Room
            </option>

            {rooms.map((room) => (

              <option
                key={room.id}
                value={room.id}
              >

                {room.room_number}

              </option>

            ))}

          </select>

        </div>

        {/* WORKER SELECT */}

        <div className="
          bg-white
          p-6
          rounded-3xl
          shadow-sm
          border
          border-gray-200
        ">

          <h2 className="
            text-lg
            font-semibold
            mb-4
          ">
            Select Employee
          </h2>

          <select
            value={selectedWorker}
            onChange={(e) =>
              setSelectedWorker(
                e.target.value
              )
            }
            className="
              border
              border-gray-300
              rounded-2xl
              p-3
              w-full
              outline-none
              focus:ring-2
              focus:ring-black
            "
          >

            <option value="">
              Choose Employee
            </option>

            {workers.map((worker) => (

              <option
                key={worker.id}
                value={worker.id}
              >

                {worker.name}
                {" — "}
                {worker.company}

              </option>

            ))}

          </select>

        </div>

      </div>

      {/* BED GRID */}

      {selectedRoom && (

        <div className="
          bg-white
          p-6
          rounded-3xl
          shadow-sm
          border
          border-gray-200
        ">

          {/* HEADER */}

          <div className="
            flex
            justify-between
            items-center
            mb-6
          ">

            <h2 className="
              text-2xl
              font-bold
            ">
              Bed Allocation
            </h2>

            <span className="
              text-sm
              text-gray-500
            ">

              Total Beds:
              {" "}
              {beds.length}

            </span>

          </div>

          {/* GRID */}

          <div className="
            grid
            grid-cols-1
            md:grid-cols-2
            lg:grid-cols-3
            gap-5
          ">

            {beds.map((bed) => {

              const occupied =
                bed.worker_id;

              return (

                <div
                  key={bed.id}
                  className={`
                    rounded-3xl
                    p-5
                    shadow-sm
                    border
                    transition

                    ${
                      occupied

                      ? "bg-red-50 border-red-200"

                      : "bg-green-50 border-green-200"
                    }
                  `}
                >

                  {/* TOP */}

                  <div className="
                    flex
                    justify-between
                    items-center
                    mb-5
                  ">

                    <h3 className="
                      text-2xl
                      font-bold
                      text-gray-900
                    ">
                      {bed.bed_number}
                    </h3>

                    <span className={`
                      text-xs
                      px-3
                      py-1
                      rounded-full
                      font-medium

                      ${
                        occupied

                        ? "bg-red-500 text-white"

                        : "bg-green-500 text-white"
                      }
                    `}>

                      {
                        occupied
                        ? "Occupied"
                        : "Available"
                      }

                    </span>

                  </div>

                  {/* CONTENT */}

                  <div className="
                    mb-5
                  ">

                    {occupied ? (

                      <div>

                        <p className="
                          text-sm
                          text-gray-500
                        ">
                          Assigned Worker
                        </p>

                        <div className="
                          mt-2
                        ">

                          <p className="
                            text-lg
                            font-semibold
                            text-gray-900
                          ">
                            {
                              bed.worker_name
                            }
                          </p>

                          <p className="
                            text-sm
                            text-gray-500
                            mt-1
                          ">
                            {
                              bed.employee_type
                            }
                          </p>

                        </div>

                      </div>

                    ) : (

                      <p className="
                        text-gray-500
                      ">
                        Ready for allocation
                      </p>

                    )}

                  </div>

                  {/* BUTTON */}

                  {!occupied ? (

                    <button
                      onClick={() =>
                        handleAssign(
                          bed.id
                        )
                      }
                      className="
                        w-full
                        bg-black
                        text-white
                        py-3
                        rounded-2xl
                        font-medium
                        hover:bg-gray-800
                        transition
                      "
                    >

                      Assign Bed

                    </button>

                  ) : (

                    <button
                      onClick={() =>
                        handleUnassign(
                          bed.id
                        )
                      }
                      className="
                        w-full
                        bg-red-500
                        text-white
                        py-3
                        rounded-2xl
                        font-medium
                        hover:bg-red-600
                        transition
                      "
                    >

                      Remove Worker

                    </button>

                  )}

                </div>

              );

            })}

          </div>

        </div>

      )}

    </div>

  );

}

export default RoomForm;