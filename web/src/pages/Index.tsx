import { Navigate } from "react-router-dom";

export default function Index() {
  const isAuth = localStorage.getItem("iot_auth") === "true";
  if (isAuth) return <Navigate to="/dashboard" replace />;
  return <Navigate to="/" replace />;
}