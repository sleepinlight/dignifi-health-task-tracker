import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const ProtectedRoute = ({ children }: any) => {
  const { user }: any = useAuth();
  if (!user || user === null) {
    console.log("user", user);
    // user is not authenticated
    return <Navigate to="/login" />;
  }
  return children;
};
