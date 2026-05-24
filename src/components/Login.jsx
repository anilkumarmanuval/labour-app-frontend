import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

// ✅ LOGOS
import logo from "../assets/logo.png";
import swiftlineLogo from "../assets/swiftline.png";

function Login() {

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] =
    useState(false);

  const navigate =
    useNavigate();

  const { login } =
    useAuth();

  // =========================
  // INPUT
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
  // LOGIN
  // =========================

  const handleLogin =
    async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const user =
        await login(
          form.email,
          form.password
        );

      // ✅ ROLE REDIRECT

      if (
        user.role ===
        "superadmin"
      ) {

        navigate("/");

      }

      else if (
        user.role ===
        "campadmin"
      ) {

        navigate("/workers");

      }

      else {

        navigate("/");

      }

    }

    catch (err) {

      console.error(
        "Login error:",
        err
      );

      alert(
        err.message
        || "Login failed"
      );

    }

    finally {

      setLoading(false);

    }

  };

  return (

    <div className="
      min-h-screen
      flex
      items-center
      justify-center
      bg-gradient-to-br
      from-slate-950
      via-slate-900
      to-gray-900
      px-4
      relative
      overflow-hidden
    ">

      {/* BG EFFECT */}

      <div className="
        absolute
        w-[500px]
        h-[500px]
        bg-blue-500/10
        blur-3xl
        rounded-full
        -top-40
        -left-40
      " />

      <div className="
        absolute
        w-[400px]
        h-[400px]
        bg-cyan-500/10
        blur-3xl
        rounded-full
        bottom-0
        right-0
      " />

      {/* LOGIN CARD */}

      <form
        onSubmit={handleLogin}
        className="
          relative
          z-10
          w-full
          max-w-md
          bg-white/10
          backdrop-blur-xl
          border
          border-white/10
          rounded-3xl
          shadow-2xl
          p-10
        "
      >

        {/* COMPANY LOGO */}

        <div className="
          flex
          flex-col
          items-center
          mb-8
        ">

          <img
            src={logo}
            alt="EOG"
            className="
              w-40
              object-contain
              mb-4
            "
          />

          <h1 className="
            text-3xl
            font-bold
            text-white
            tracking-wide
          ">
            Camp Management
          </h1>

          <p className="
            text-gray-300
            text-sm
            mt-2
          ">
            Secure workforce management platform
          </p>

        </div>

        {/* EMAIL */}

        <div className="mb-5">

          <label className="
            text-sm
            text-gray-300
            mb-2
            block
          ">
            Email Address
          </label>

          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
            required
            className="
              w-full
              p-4
              rounded-2xl
              bg-white/10
              border
              border-white/10
              text-white
              placeholder-gray-400
              outline-none
              focus:ring-2
              focus:ring-cyan-400
              transition
            "
          />

        </div>

        {/* PASSWORD */}

        <div className="mb-7">

          <label className="
            text-sm
            text-gray-300
            mb-2
            block
          ">
            Password
          </label>

          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            required
            className="
              w-full
              p-4
              rounded-2xl
              bg-white/10
              border
              border-white/10
              text-white
              placeholder-gray-400
              outline-none
              focus:ring-2
              focus:ring-cyan-400
              transition
            "
          />

        </div>

        {/* BUTTON */}

        <button
          type="submit"
          disabled={loading}
          className={`
            w-full
            p-4
            rounded-2xl
            font-semibold
            text-white
            text-lg
            transition-all
            duration-300
            shadow-lg

            ${
              loading

              ? `
                bg-gray-500
                cursor-not-allowed
              `

              : `
                bg-gradient-to-r
                from-cyan-500
                to-blue-600
                hover:scale-[1.02]
                hover:shadow-cyan-500/30
              `
            }
          `}
        >

          {
            loading
            ? "Logging in..."
            : "Login"
          }

        </button>

        {/* FOOTER */}

        <div className="
          mt-10
          pt-6
          border-t
          border-white/10
          flex
          flex-col
          items-center
          gap-2
        ">

          

        </div>

      </form>

    </div>

  );

}

export default Login;