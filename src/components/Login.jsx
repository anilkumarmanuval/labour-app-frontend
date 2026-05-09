import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function Login() {

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ✅ AUTH CONTEXT
  const { login } = useAuth();

  // =========================
  // 🔄 HANDLE INPUT
  // =========================
  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };

  // =========================
  // 🔐 LOGIN
  // =========================
  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      // ✅ CONTEXT LOGIN
      const user = await login(
        form.email,
        form.password
      );

      // ✅ ROLE REDIRECT
      if (user.role === "superadmin") {

        navigate("/");

      } else if (
        user.role === "campadmin"
      ) {

        navigate("/workers");

      } else {

        navigate("/");

      }

    } catch (err) {

      console.error(
        "Login error:",
        err
      );

      alert(
        err.message || "Login failed"
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">

      <form
        onSubmit={handleLogin}
        className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-sm"
      >

        {/* TITLE */}
        <div className="mb-8 text-center">

          <h1 className="text-3xl font-bold text-white">
            Camp System
          </h1>

          <p className="text-gray-400 mt-2 text-sm">
            Login to continue
          </p>

        </div>

        {/* EMAIL */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="
            w-full
            p-3
            mb-4
            rounded-xl
            bg-gray-700
            text-white
            outline-none
            focus:ring-2
            focus:ring-blue-500
          "
        />

        {/* PASSWORD */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="
            w-full
            p-3
            mb-6
            rounded-xl
            bg-gray-700
            text-white
            outline-none
            focus:ring-2
            focus:ring-blue-500
          "
        />

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className={`
            w-full
            p-3
            rounded-xl
            font-semibold
            text-white
            transition
            ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }
          `}
        >

          {loading
            ? "Logging in..."
            : "Login"}

        </button>

      </form>

    </div>
  );
}

export default Login;