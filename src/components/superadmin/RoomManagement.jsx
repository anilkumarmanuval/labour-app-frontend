import {
  useEffect,
  useState
} from "react";

import {
  GET,
  POST
} from "../../utils/api";

function AllRooms() {

  const [rooms, setRooms] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [open, setOpen] =
    useState(false);

  const [selectedRoom, setSelectedRoom] =
    useState(null);

  const [roomBeds, setRoomBeds] =
    useState([]);

  const [form, setForm] =
    useState({
      room_number: "",
      floor: "",
      capacity: 1
    });

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

      console.error(err);

    }

  };

  useEffect(() => {

    fetchRooms();

  }, []);

  // =========================
  // HANDLE CHANGE
  // =========================

  const handleChange =
    (e) => {

    setForm({
      ...form,
      [e.target.name]:
        e.target.value
    });

  };

  // =========================
  // ROOM DETAILS
  // =========================

  const fetchRoomDetails =
    async (room) => {

    try {

      const data =
        await GET(
          `/room-details/${room.id}`
        );

      setSelectedRoom(room);

      setRoomBeds(data);

      setOpen(true);

    } catch (err) {

      console.error(err);

    }

  };

  // =========================
  // CREATE ROOM
  // =========================

  const handleSubmit =
    async (e) => {

    e.preventDefault();

    if (loading) return;

    setLoading(true);

    try {

      await POST(
        "/rooms",
        form
      );

      alert(
        "Room created!"
      );

      setForm({
        room_number: "",
        floor: "",
        capacity: 1
      });

      fetchRooms();

    } catch (err) {

      alert(err.message);

    } finally {

      setLoading(false);

    }

  };

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
          Room Management
        </h1>

        <p className="
          text-gray-500
          mt-1
        ">
          Create and manage camp rooms
        </p>

      </div>

      {/* CREATE FORM */}

      <div className="
        bg-white
        shadow-lg
        rounded-2xl
        p-6
      ">

        <form
          onSubmit={handleSubmit}
          className="
            grid
            grid-cols-1
            md:grid-cols-4
            gap-4
          "
        >

          {/* ROOM NUMBER */}

          <input
            type="text"
            name="room_number"
            placeholder="Room Number"
            value={form.room_number}
            onChange={handleChange}
            className="
              border
              rounded-xl
              px-4
              py-3
            "
            required
          />

          {/* FLOOR */}

          <input
            type="text"
            name="floor"
            placeholder="Floor"
            value={form.floor}
            onChange={handleChange}
            className="
              border
              rounded-xl
              px-4
              py-3
            "
          />

          {/* CAPACITY */}

          <select
            name="capacity"
            value={form.capacity}
            onChange={handleChange}
            className="
              border
              rounded-xl
              px-4
              py-3
            "
          >

            {[1,2,3,4,5,6,7,8]
            .map((num) => (

              <option
                key={num}
                value={num}
              >
                {num} Bed Room
              </option>

            ))}

          </select>

          {/* BUTTON */}

          <button
            type="submit"
            disabled={loading}
            className="
              bg-blue-600
              text-white
              rounded-xl
              py-3
              hover:bg-blue-700
              transition
            "
          >

            {loading
              ? "Creating..."
              : "Create Room"}

          </button>

        </form>

      </div>

      {/* ROOM GRID */}

      <div className="
        grid
        grid-cols-1
        md:grid-cols-2
        lg:grid-cols-3
        gap-6
      ">

        {rooms.map((room) => (

          <div
            key={room.id}
            onClick={() =>
              fetchRoomDetails(room)
            }
            className="
              bg-white
              rounded-2xl
              shadow-lg
              cursor-pointer
              p-6
              border
              border-gray-100
              hover:shadow-2xl
              transition
            "
          >

            {/* ROOM HEADER */}

            <div className="
              flex
              justify-between
              items-center
              mb-4
            ">

              <div>

                <h2 className="
                  text-2xl
                  font-bold
                ">
                  {room.room_number}
                </h2>

                <p className="
                  text-gray-500
                ">
                  Floor:
                  {" "}
                  {room.floor || "-"}
                </p>

              </div>

              <span className="
                bg-blue-100
                text-blue-700
                px-3
                py-1
                rounded-full
                text-sm
                font-medium
              ">
                {room.capacity} Beds
              </span>

            </div>

            {/* OCCUPANCY */}

            <div className="
              mb-4
            ">

              <div className="
                flex
                justify-between
                text-sm
                mb-2
              ">

                <span>
                  Occupancy
                </span>

                <span>
                  {room.occupied || 0}
                  /
                  {room.capacity}
                </span>

              </div>

              {/* PROGRESS */}

              <div className="
                w-full
                bg-gray-200
                rounded-full
                h-3
              ">

                <div
                  className="
                    bg-green-500
                    h-3
                    rounded-full
                  "
                  style={{
                    width: `${
                      (
                        (room.occupied || 0)
                        /
                        room.capacity
                      ) * 100
                    }%`
                  }}
                />

              </div>

            </div>

            {/* STATUS */}

            <div className="
              flex
              justify-between
              items-center
            ">

              <span className="
                text-sm
                text-gray-500
              ">
                Status
              </span>

              <span className={`
                px-3
                py-1
                rounded-full
                text-sm
                font-medium

                ${
                  room.status ===
                  "available"

                  ? "bg-green-100 text-green-700"

                  : "bg-red-100 text-red-700"
                }
              `}>

                {room.status}

              </span>

            </div>

          </div>

        ))}

      </div>

      {/* ROOM DETAILS MODAL */}

      {
        open && (

          <div className="
            fixed
            inset-0
            bg-black/40
            flex
            items-center
            justify-center
            z-50
          ">

            <div className="
              bg-white
              rounded-2xl
              p-6
              w-[500px]
              max-h-[80vh]
              overflow-y-auto
            ">

              {/* HEADER */}

              <div className="
                flex
                justify-between
                items-center
                mb-6
              ">

                <div>

                  <h2 className="
                    text-2xl
                    font-bold
                  ">
                    {selectedRoom?.room_number}
                  </h2>

                  <p className="
                    text-gray-500
                  ">
                    Room Details
                  </p>

                </div>

                <button
                  onClick={() =>
                    setOpen(false)
                  }
                  className="
                    text-gray-500
                    hover:text-black
                    text-xl
                  "
                >
                  ✕
                </button>

              </div>

              {/* BEDS */}

              <div className="
                space-y-3
              ">

                {roomBeds.map((bed) => (

                  <div
                    key={bed.id}
                    className="
                      border
                      rounded-xl
                      p-4
                      flex
                      justify-between
                      items-center
                    "
                  >

                    <div>

                      <h3 className="
                        font-semibold
                      ">
                        {bed.bed_number}
                      </h3>

                      {
                        bed.name ? (

                          <div className="
                            text-sm
                            text-gray-600
                          ">

                            <p>
                              {bed.name}
                            </p>

                            <p>
                              {bed.company}
                            </p>

                            <p className="
                              capitalize
                            ">
                              {bed.employee_type}
                            </p>

                          </div>

                        ) : (

                          <p className="
                            text-sm
                            text-gray-400
                          ">
                            Empty Bed
                          </p>

                        )
                      }

                    </div>

                    <span className={`
                      px-3
                      py-1
                      rounded-full
                      text-xs
                      font-medium

                      ${
                        bed.name
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-600"
                      }
                    `}>

                      {
                        bed.name
                        ? "Occupied"
                        : "Available"
                      }

                    </span>

                  </div>

                ))}

              </div>

            </div>

          </div>

        )
      }

    </div>

  );

}

export default AllRooms;