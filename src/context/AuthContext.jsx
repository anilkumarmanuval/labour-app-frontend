import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import {
  GET,
  POST
} from "../utils/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  // =========================
  // 🔄 RESTORE LOGIN
  // =========================
  useEffect(() => {

    const restoreUser = async () => {

      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {

        const data = await GET("/me");

        setUser(data.user);

      } catch (err) {

        console.error(err);

        localStorage.removeItem("token");

        setUser(null);

      } finally {

        setLoading(false);

      }
    };

    restoreUser();

  }, []);

  // =========================
  // 🔐 LOGIN
  // =========================
  const login = async (
    email,
    password
  ) => {

    const data = await POST(
      "/login",
      {
        email,
        password
      }
    );

    localStorage.setItem(
      "token",
      data.token
    );

    setUser(data.user);

    return data.user;
  };

  // =========================
  // 🚪 LOGOUT
  // =========================
  const logout = async () => {

    try {

      await POST("/logout");

    } catch (err) {

      console.error(err);

    }

    localStorage.removeItem("token");

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// =========================
// 🪝 HOOK
// =========================
export function useAuth() {

  return useContext(AuthContext);

}