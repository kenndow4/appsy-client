import Cookies from "js-cookie";
import { Navigate } from "react-router-dom";

type Props = {
  children: React.ReactNode;
};

export const PublicRoute = ({ children }: Props) => {
  const token = Cookies.get("token");

  if (token) {
    return <Navigate to="/" replace />;
  }

  return children;
};