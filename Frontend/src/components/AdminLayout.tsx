import { Outlet, Navigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { AdminSidebar } from "./AdminSidebar";

export const AdminLayout = () => {
  const { user } = useApp();

  // Basic role-based protection
  if (!user || user.role !== "admin") {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="ml-64 flex-1">
        <Outlet />
      </main>
    </div>
  );
};
