import { Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./components/Dashboard";
import WorkerForm from "./components/WorkerForm";
import RoomForm from "./components/RoomForm";
import CampForm from "./components/CampForm";
import Login from "./components/Login";
import Attendance from "./components/Attendance";
import Topbar from "./components/superadmin/Topbar";
import Sidebar from "./components/superadmin/Sidebar";
import AllWorkers from "./components/superadmin/AllWorkers";
import AllRooms from "./components/superadmin/AllRooms";
import CampList from "./components/superadmin/CampList";
import RoomManagement from "./components/superadmin/RoomManagement";
import ProtectedRoute from "./components/ProtectedRoute";
import DeviceManagement from "./components/superadmin/DeviceManagement";
import Reports from "./components/superadmin/Reports";
import CardManagement from "./components/superadmin/CardManagement";

// ✅ AUTH CONTEXT
import { useAuth } from "./context/AuthContext";

function App() {

  // =========================
  // 🔐 AUTH
  // =========================
  const {
    user,
    loading,
    logout
  } = useAuth();

  // =========================
  // ⏳ LOADING
  // =========================
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-xl">
        Loading...
      </div>
    );
  }

  // =========================
  // 🔐 LOGIN PAGE
  // =========================
  if (!user) {
    return (
      <Routes>
        <Route
          path="*"
          element={<Login />}
        />
      </Routes>
    );
  }



  // =========================
  // 👤 USER DATA
  // =========================
  const role = user?.role;
  const campId = user?.campId;

  return (
    <div className="flex">

      {/* ========================= */}
      {/* 🧭 SIDEBAR */}
      {/* ========================= */}

      <Sidebar
        role={role}
        handleLogout={logout}
      />

      {/* ========================= */}
      {/* 📄 MAIN */}
      {/* ========================= */}

      <div className="ml-64 w-full bg-gray-100 min-h-screen flex flex-col">

        {/* 🔝 TOPBAR */}
        <Topbar />

        {/* 📦 PAGE CONTENT */}
        <div className="p-8">

          <Routes>

            {/* ========================= */}
            {/* 🏠 DASHBOARD */}
            {/* ========================= */}

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard
                    campId={campId}
                    role={role}
                  />
                </ProtectedRoute>
              }
            />

            {/* ========================= */}
            {/* 🟡 CAMP ADMIN */}
            {/* ========================= */}

            <Route
              path="/workers"
              element={
                <ProtectedRoute roles={["campadmin"]}>
                  <WorkerForm campId={campId} />
                </ProtectedRoute>
              }
            />

            <Route
  path="/room-allocation"
              element={
                <ProtectedRoute roles={["campadmin"]}>
                  <RoomForm campId={campId} />
                </ProtectedRoute>
              }
            />


            {/* ========================= */}
            {/* 🔴 SUPERADMIN */}
            {/* ========================= */}

<Route path="/camp" element={ <ProtectedRoute roles={["superadmin"]}> <CampForm /> </ProtectedRoute> }/>
<Route path="/camp-list" element={ <ProtectedRoute roles={["superadmin"]}> <CampList /> </ProtectedRoute> }/>
<Route path="/all-workers" element={<ProtectedRoute roles={["superadmin"]}> <AllWorkers /></ProtectedRoute> }/>
<Route path="/all-rooms" element={<ProtectedRoute roles={["superadmin"]}> <AllRooms /></ProtectedRoute>}/>
<Route path="/room-management"element={<ProtectedRoute roles={["superadmin"]}><RoomManagement /></ProtectedRoute>}/>
<Route  path="/devices"  element={<DeviceManagement />} />
<Route path="/reports" element={ <ProtectedRoute roles={["superadmin"]} > <Reports /> </ProtectedRoute> }/>
<Route path="/cards" element={<CardManagement />} />
            
            
            
            
            
            {/* ========================= */}
            {/* 🕒 ATTENDANCE */}
            {/* ========================= */}

            <Route
              path="/attendance"
              element={
                <ProtectedRoute
                  roles={[
                    "superadmin",
                    "campadmin"
                  ]}
                >
                  <Attendance campId={campId} />
                </ProtectedRoute>
              }
            />

            {/* ========================= */}
            {/* ❌ UNKNOWN ROUTES */}
            {/* ========================= */}

            <Route
              path="*"
              element={
                <Navigate
                  to="/"
                  replace
                />
              }
            />

          </Routes>

        </div>

      </div>

    </div>
  );
}

export default App;