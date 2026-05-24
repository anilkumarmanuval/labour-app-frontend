import { useEffect, useState } from "react";
import { GET, POST } from "../../utils/api";

function AllRooms() {

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [roomBeds, setRoomBeds] = useState([]);

  const [form, setForm] = useState({
    room_number: "",
  });

  // =========================
  // FETCH ROOMS
  // =========================

  const fetchRooms = async () => {
    try {

      const data = await GET("/rooms");
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

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]:
        e.target.value.toUpperCase(),
    });

  };

  // =========================
  // DETECT ROOM TYPE
  // =========================

  const getRoomInfo =
    (roomNumber) => {

    const prefix =
      roomNumber
      ?.charAt(0)
      ?.toUpperCase();

    if (prefix === "G") {
      return {
        type: "Junior Sleeper",
        capacity: 4
      };
    }

    if (prefix === "J") {
      return {
        type: "Senior Sleeper",
        capacity: 2
      };
    }

    if (prefix === "S") {
      return {
        type: "Single Room",
        capacity: 1
      };
    }

    return {
      type: "Unknown",
      capacity: 0
    };
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

    const roomInfo =
      getRoomInfo(
        form.room_number
      );

    if (
      roomInfo.capacity === 0
    ) {

      alert(
        "Invalid room series. Use G, J or S"
      );

      return;
    }

    setLoading(true);

    try {

      await POST(
        "/rooms",
        {
          room_number:
            form.room_number,
          capacity:
            roomInfo.capacity,
        }
      );

      alert(
        "Room created successfully!"
      );

      setForm({
        room_number: "",
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
      md:p-8
      bg-gray-50
      min-h-screen
      font-sans
      space-y-8
    ">

      {/* HEADER */}

      <div>

        <h1 className="
          text-3xl
          font-bold
          text-gray-900
        ">
          Room Management
        </h1>

        <p className="
          text-gray-500
          mt-1
        ">
          Manage camp rooms and beds
        </p>

      </div>

      {/* CREATE ROOM */}

      <div className="
        bg-white
        border
        border-gray-200
        rounded-3xl
        shadow-sm
        p-6
      ">

        <h2 className="
          text-xl
          font-semibold
          mb-6
          text-gray-900
        ">
          Create New Room
        </h2>

        <form
          onSubmit={handleSubmit}
          className="
            grid
            grid-cols-1
            md:grid-cols-3
            gap-5
            items-end
          "
        >

          {/* ROOM NUMBER */}

          <div>

            <label className="
              block
              mb-2
              text-sm
              font-medium
              text-gray-500
            ">
              Room Number
            </label>

            <input
              type="text"
              name="room_number"
              placeholder="Example: G01"
              value={form.room_number}
              onChange={handleChange}
              className="
                w-full
                rounded-2xl
                border
                border-gray-200
                bg-gray-50
                px-4
                py-3
                text-gray-900
                outline-none
                focus:border-black
                focus:ring-1
                focus:ring-black
              "
              required
            />

          </div>

          {/* AUTO DETECT */}

          <div>

            <label className="
              block
              mb-2
              text-sm
              font-medium
              text-gray-500
            ">
              Auto Detected
            </label>

            <div className="
              w-full
              rounded-2xl
              border
              border-gray-200
              bg-gray-100
              px-4
              py-3
              text-gray-700
              h-[52px]
              flex
              items-center
            ">

              {
                getRoomInfo(
                  form.room_number
                ).capacity > 0

                ? (
                  <>
                    {
                      getRoomInfo(
                        form.room_number
                      ).type
                    }

                    {" • "}

                    {
                      getRoomInfo(
                        form.room_number
                      ).capacity
                    }

                    {" Beds"}
                  </>
                )

                : (
                  <span className="
                    text-gray-400
                  ">
                    Waiting for valid room...
                  </span>
                )
              }

            </div>

          </div>

          {/* BUTTON */}

          <div>

            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                rounded-2xl
                bg-black
                px-6
                py-3
                text-white
                font-medium
                hover:bg-gray-800
                transition
              "
            >

              {
                loading
                ? "Creating..."
                : "Create Room"
              }

            </button>

          </div>

        </form>

      </div>

      {/* ROOM GRID */}

      <div className="
        grid
        grid-cols-1
        md:grid-cols-2
        lg:grid-cols-3
        xl:grid-cols-4
        gap-6
      ">

        {rooms.map((room) => {

          const roomInfo =
            getRoomInfo(
              room.room_number
            );

          const occupancyRate =
            (
              (
                room.occupied || 0
              ) / room.capacity
            ) * 100;

          return (

            <div
              key={room.id}
              onClick={() =>
                fetchRoomDetails(room)
              }
              className="
                bg-white
                border
                border-gray-200
                rounded-3xl
                p-6
                shadow-sm
                hover:shadow-lg
                transition
                cursor-pointer
              "
            >

              {/* TOP */}

              <div className="
                flex
                justify-between
                items-start
                mb-6
              ">

                <div>

                  <h2 className="
                    text-3xl
                    font-bold
                    text-gray-900
                  ">
                    {
                      room.room_number
                    }
                  </h2>

                </div>

                <span className="
                  px-3
                  py-1
                  rounded-full
                  bg-gray-100
                  text-gray-700
                  text-xs
                  font-semibold
                ">

                  {
                    roomInfo.type
                  }

                </span>

              </div>

              {/* OCCUPANCY */}

              <div className="
                mb-5
              ">

                <div className="
                  flex
                  justify-between
                  text-sm
                  text-gray-500
                  mb-2
                ">

                  <span>
                    Occupancy
                  </span>

                  <span>
                    {
                      room.occupied || 0
                    }
                    /
                    {room.capacity}
                  </span>

                </div>

                <div className="
                  w-full
                  bg-gray-200
                  rounded-full
                  h-2
                ">

                  <div
                    className="
                      bg-black
                      h-2
                      rounded-full
                    "
                    style={{
                      width:
                        `${occupancyRate}%`
                    }}
                  />

                </div>

              </div>

              {/* FOOTER */}

              <div className="
                flex
                justify-between
                items-center
              ">

                <span className="
                  text-sm
                  text-gray-500
                ">
                  Capacity
                </span>

                <span className="
                  bg-black
                  text-white
                  px-3
                  py-1
                  rounded-full
                  text-sm
                  font-semibold
                ">
                  {room.capacity} Beds
                </span>

              </div>

            </div>

          );

        })}

      </div>

      {/* MODAL */}

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
            p-4
          ">

            <div className="
              bg-white
              rounded-3xl
              p-6
              w-full
              max-w-lg
              max-h-[85vh]
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
                    {
                      selectedRoom
                      ?.room_number
                    }
                  </h2>

                  <p className="
                    text-gray-500
                  ">
                    Bed Assignments
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
                      border-gray-200
                      rounded-2xl
                      p-4
                      flex
                      justify-between
                      items-center
                    "
                  >

                    <div>

                      <h3 className="
                        text-lg
                        font-semibold
                      ">
                        {
                          bed.bed_number
                        }
                      </h3>

                      {
                        bed.name ? (

                          <div className="
                            text-sm
                            text-gray-600
                            mt-1
                          ">

                            <p>
                              {bed.name}
                            </p>

                            <p>
                              {bed.company}
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

                        ? "bg-gray-200 text-gray-700"

                        : "bg-black text-white"
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