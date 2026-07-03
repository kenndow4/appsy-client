import { getUserApi, loginApi, registerApi } from "@/api/auth";
import axios from "axios";
import Cookies from "js-cookie";

import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import { useNavigate } from "react-router-dom";


// ================= TYPES =================

interface User {
  id: string;
  name: string;
  avatar: string;
  email: string;
}

interface AuthContextType {
  user: User | null;

  login: (
    email: string,
    password: string
  ) => Promise<void>;

  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => void;

  loading: boolean;
  userLoading: boolean;
  error: string | null;
}


// ================= CONTEXT =================

// crear caja global vacía
const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);


// ================= PROVIDER =================

// ESTE ES EL VERDADERO PROVIDER
export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {

  // estado global
  const [user, setUser] = useState<User | null>(null);

  const [loading, setLoading] = useState(false);

  const [userLoading, setUserLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
  getMe();
}, []);


  const getMe = async () => {
  try {
    setUserLoading(true);
    const token = Cookies.get("token");

    if (!token) return;

    const res = await getUserApi(token);

    setUser(res);
  } catch (err) {
    Cookies.remove("token");
    setUser(null);
  } finally {
    setUserLoading(false);
  }
};

  const login = async (
    email: string,
    password: string
  ) => {

    setLoading(true);
    setError(null);

    if (!email || !password) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    try {

      const res = await loginApi(
        email,
        password
      );

      Cookies.set("token", res.token, {
        expires: 7,
      });

      setUser(res.user);
      

      // navegar
      navigate("/");

    } catch (err) {

      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
          "Login failed"
        );
      } else {
        setError("Unknown error");
      }

    } finally {
      setLoading(false);
    }
  };


  // ===== REGISTER =====

  const register = async (
    name: string,
    email: string,
    password: string
  ) => {

    setLoading(true);
    setError(null);

    if (!name || !email || !password) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    try {

      await registerApi(
        name,
        email,
        password
      );

      navigate("/login");

    } catch (err) {

      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
          "Register failed"
        );
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
  }


  // compartir con toda la app
  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        loading,
        userLoading,
        error
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be inside AuthProvider");
  }

  return context;
};