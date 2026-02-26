import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Toaster } from "@/components/ui/sonner";

export default function AppLayout() {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>

      {/* Toast Notifications */}
      <Toaster position="top-right" />
    </div>
  );
}
