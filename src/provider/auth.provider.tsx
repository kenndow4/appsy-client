import { getUserApi, loginApi, registerApi } from "@/api/auth";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext, type User } from "./auth.context";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [userLoading, setUserLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const getMe = async () => {
      try {
        setUserLoading(true);
        const token = Cookies.get("token");

        if (!token) return;

        const res = await getUserApi(token);
        setUser(res);
      } catch {
        Cookies.remove("token");
        setUser(null);
      } finally {
        setUserLoading(false);
      }
    };

    getMe();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    if (!email || !password) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    try {
      const res = await loginApi(email, password);

      Cookies.set("token", res.token, { expires: 7 });
      setUser(res.user);

      navigate("/");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Login failed");
      } else {
        setError("Unknown error");
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);

    if (!name || !email || !password) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    try {
      await registerApi(name, email, password);
      navigate("/login");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Register failed");
      } else {
        setError("Unknown error");
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    Cookies.remove("token");
    Cookies.remove("boardId");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, loading, userLoading, error }}
    >
      {children}
    </AuthContext.Provider>
  );
};
