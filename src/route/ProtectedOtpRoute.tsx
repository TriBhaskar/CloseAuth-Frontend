// ProtectedRoutes.tsx
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { ReactNode } from "react";

interface RequireRegistrationProps {
  children: ReactNode;
}

export const RequireRegistration = ({ children }: RequireRegistrationProps) => {
  const { pendingVerification } = useAuth();

  // Also check session storage in case of page refresh
  const checkStoredToken = () => {
    const storedToken = sessionStorage.getItem("pendingVerification");
    if (!storedToken) return false;

    try {
      const token = JSON.parse(storedToken);
      if (Date.now() > token.expires) {
        sessionStorage.removeItem("pendingVerification");
        return false;
      }
      return true;
    } catch {
      return false;
    }
  };

  if (!pendingVerification && !checkStoredToken()) {
    return <Navigate to="/register" replace />;
  }

  return <>{children}</>;
};
