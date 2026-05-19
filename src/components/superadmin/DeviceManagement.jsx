import {
  useEffect,
  useState
} from "react";

import {
  GET,
  POST,
  DELETE,
  PUT
} from "../../utils/api";

import {
  Cpu,
  Trash2,
  Wifi,
  WifiOff,
  Pencil
} from "lucide-react";

function DeviceManagement() {

  const [devices, setDevices] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [form, setForm] =
    useState({
      device_name: "",
      serial_number: "",
      ip_address: "",
      location: ""
    });

  // =========================
  // FETCH DEVICES
  // =========================

  const fetchDevices =
    async () => {

      try {

        const data =
          await GET("/devices");

        console.log(
          "DEVICES:",
          data
        );

        setDevices(
          Array.isArray(data)
            ? data
            : []
        );

      } catch (err) {

        console.error(
          "FETCH ERROR:",
          err
        );

      }

    };

  useEffect(() => {

    fetchDevices();

    // AUTO REFRESH
    const interval =
      setInterval(
        fetchDevices,
        10000
      );

    return () =>
      clearInterval(interval);

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
  // CREATE DEVICE
  // =========================

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      if (loading) return;

      setLoading(true);

      try {

        await POST(
          "/devices",
          form
        );

        alert(
          "Device added!"
        );

        setForm({
          device_name: "",
          serial_number: "",
          ip_address: "",
          location: ""
        });

        fetchDevices();

      } catch (err) {

        console.error(err);

        alert(
          "Failed to add device"
        );

      } finally {

        setLoading(false);

      }

    };

  // =========================
  // DELETE DEVICE
  // =========================

  const handleDelete =
    async (id) => {

      const confirmDelete =
        window.confirm(
          "Delete device?"
        );

      if (!confirmDelete)
        return;

      try {

        await DELETE(
          `/devices/${id}`
        );

        fetchDevices();

      } catch (err) {

        console.error(err);

        alert(
          "Delete failed"
        );

      }

    };

  // =========================
  // RENAME DEVICE
  // =========================

  const handleRename =
    async (device) => {

      const newName =
        prompt(
          "Enter new device name",
          device.device_name
        );

      if (!newName) return;

      try {

        await PUT(

          `/devices/${device.id}`,

          {
            device_name:
              newName
          }
        );

        fetchDevices();

      } catch (err) {

        console.error(err);

        alert(
          "Rename failed"
        );

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
          Device Management
        </h1>

        <p className="
          text-gray-500
          mt-1
        ">
          Manage NFC & attendance devices
        </p>

      </div>

  

      {/* DEVICE GRID */}

      <div className="
        grid
        grid-cols-1
        md:grid-cols-2
        lg:grid-cols-3
        gap-6
      ">

        {devices.length === 0 ? (

          <div className="
            text-gray-500
          ">
            No devices connected
          </div>

        ) : (

          devices.map((device) => (

            <div
              key={device.id}
              className="
                bg-white
                rounded-2xl
                shadow-lg
                p-6
                border
                border-gray-100
              "
            >

              {/* TOP */}

              <div className="
                flex
                justify-between
                items-start
                mb-5
              ">

                <div className="
                  flex
                  items-center
                  gap-3
                ">

                  <div className="
                    bg-blue-100
                    p-3
                    rounded-xl
                  ">

                    <Cpu
                      className="
                        text-blue-600
                      "
                    />

                  </div>

                  <div>

                    <h2 className="
                      text-lg
                      font-bold
                    ">
                      {
                        device.device_name
                      }
                    </h2>

                    <p className="
                      text-sm
                      text-gray-500
                    ">
                      {
                        device.serial_number
                      }
                    </p>

                  </div>

                </div>

                <div className="
                  flex
                  items-center
                  gap-2
                ">

                  <button
                    onClick={() =>
                      handleRename(device)
                    }
                    className="
                      text-blue-500
                    "
                  >

                    <Pencil size={18} />

                  </button>

                  <button
                    onClick={() =>
                      handleDelete(device.id)
                    }
                    className="
                      text-red-500
                    "
                  >

                    <Trash2 size={18} />

                  </button>

                </div>

              </div>

              {/* DETAILS */}

              <div className="
                space-y-3
                text-sm
              ">

                <div className="
                  flex
                  justify-between
                ">

                  <span className="
                    text-gray-500
                  ">
                    IP Address
                  </span>

                  <span>
                    {
                      device.ip_address || "-"
                    }
                  </span>

                </div>

                <div className="
                  flex
                  justify-between
                ">

                  <span className="
                    text-gray-500
                  ">
                    Firmware
                  </span>

                  <span>
                    {
                      device.firmware_version || "-"
                    }
                  </span>

                </div>

                <div className="
                  flex
                  justify-between
                ">

                  <span className="
                    text-gray-500
                  ">
                    Last Seen
                  </span>

                  <span>
                    {
                      device.last_seen
                        ? new Date(
                            device.last_seen
                          ).toLocaleString()
                        : "-"
                    }
                  </span>

                </div>

                <div className="
                  flex
                  justify-between
                  items-center
                ">

                  <span className="
                    text-gray-500
                  ">
                    Status
                  </span>

                  <span className={`
                    flex
                    items-center
                    gap-1
                    px-3
                    py-1
                    rounded-full
                    text-xs
                    font-medium

                    ${
                      device.status === "online"

                        ? "bg-green-100 text-green-700"

                        : "bg-red-100 text-red-700"
                    }
                  `}>

                    {
                      device.status === "online"

                        ? <Wifi size={14} />

                        : <WifiOff size={14} />
                    }

                    {device.status}

                  </span>

                </div>

              </div>

            </div>

          ))

        )}

      </div>

    </div>

  );

}

export default DeviceManagement;