// client/src/components/admin/AdminProtectedRoute.tsx

import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

export default function AdminProtectedRoute() {
  const [status, setStatus] = useState<"loading" | "authenticated" | "unauthorized">(
    "loading"
  );

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/admin/auth/me",
          {
            credentials: "include",
          }
        );

        setStatus(response.ok ? "authenticated" : "unauthorized");
      } catch {
        setStatus("unauthorized");
      }
    };

    checkAuth();
  }, []);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthorized") {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}