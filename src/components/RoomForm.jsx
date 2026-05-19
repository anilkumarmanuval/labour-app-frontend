import { useEffect, useState } from "react";

import {
  GET,
  PUT
} from "../utils/api";

function RoomForm({ campId }) {

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

  // =========================
  // FETCH DATA
  // =========================

  useEffect(() => {

    fetchRooms();
    fetchWorkers();

  }, []);

  // =========================
  // FETCH ROOMS
  // =========================

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

  // =========================
  // FETCH WORKERS
  // =========================

  const fetchWorkers =
    async () => {

    try {

      const data =
        await GET("/available-workers");

      setWorkers(data);

    } catch (err) {

      setError(err.message);

    }

  };

  // =========================
  // FETCH BEDS
  // =========================

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

  // =========================
  // ASSIGN BED
  // =========================

  const handleAssign =
    async (bedId) => {

    if (!selectedWorker) {

      return alert(
        "Select worker first"
      );

    }

    try {

      await PUT(
        "/beds/assign",
        {
          bed_id: bedId,
          worker_id:
            selectedWorker
        }
      );

      fetchBeds(
        selectedRoom
      );
await fetchWorkers();
setSelectedWorker("");
    } catch (err) {

      alert(err.message);

    }

  };

  // =========================
  // UNASSIGN BED
  // =========================

  const handleUnassign =
    async (bedId) => {

    try {

      await PUT(
        "/beds/unassign",
        {
          bed_id: bedId
        }
      );

      fetchBeds(
        selectedRoom
      );

    } catch (err) {

      alert(err.message);

    }

  };

  // =========================
  // ERROR UI
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
      p-6
      space-y-6
    ">

      {/* HEADER */}

      <div>

        <h1 className="
          text-3xl
          font-bold
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

        {/* SELECT ROOM */}

        <div className="
          bg-white
          p-6
          rounded-2xl
          shadow-lg
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
              rounded-xl
              p-3
              w-full
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

        {/* SELECT WORKER */}

        <div className="
          bg-white
          p-6
          rounded-2xl
          shadow-lg
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
              rounded-xl
              p-3
              w-full
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
          rounded-2xl
          shadow-lg
        ">

          <div className="
            flex
            justify-between
            items-center
            mb-6
          ">

            <h2 className="
              text-xl
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

          <div className="
            grid
            grid-cols-1
            md:grid-cols-2
            lg:grid-cols-3
            gap-4
          ">

            {beds.map((bed) => {

              const occupied =
                bed.worker_id;

              return (

                <div
                  key={bed.id}
                  className={`
                    rounded-2xl
                    p-5
                    text-white
                    shadow-lg
                    transition

                    ${
                      occupied

                      ? "bg-red-500"

                      : "bg-green-500"
                    }
                  `}
                >

                  {/* BED NUMBER */}

                  <div className="
                    flex
                    justify-between
                    items-center
                    mb-4
                  ">

                    <h3 className="
                      text-xl
                      font-bold
                    ">
                      {bed.bed_number}
                    </h3>

                    <span className="
                      text-xs
                      bg-white/20
                      px-2
                      py-1
                      rounded-full
                    ">

                      {occupied
                        ? "Occupied"
                        : "Available"}

                    </span>

                  </div>

                  {/* STATUS */}

                  <div className="
                    mb-4
                  ">

                    {occupied ? (

                      <div>

                        <p className="
                          text-sm
                          opacity-90
                        ">
                          Assigned Worker
                        </p>

                       <div>

  <p className="
    text-lg
    font-semibold
  ">
    {bed.worker_name}
  </p>

  <p className="
    text-xs
    opacity-80
    mt-1
  ">
    {bed.employee_type}
  </p>

</div>

                      </div>

                    ) : (

                      <p className="
                        text-sm
                        opacity-90
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
                        bg-white
                        text-green-600
                        w-full
                        py-2
                        rounded-xl
                        font-semibold
                        hover:bg-gray-100
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
                        bg-white
                        text-red-600
                        w-full
                        py-2
                        rounded-xl
                        font-semibold
                        hover:bg-gray-100
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