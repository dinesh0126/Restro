import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function AdminLayout({ role }) {
  return (
    <div className="min-h-screen bg-gray-800 text-white md:flex">
      <Sidebar role={role} />
      <div className="flex-1 pt-16 md:pt-0">
        <main className="h-full overflow-auto p-4 sm:p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
