import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function AdminLayout({ role }) {
  return (
    <div className="min-h-screen text-white">
      <Sidebar role={role} />
      <div className="pt-16 md:pl-72 md:pt-0">
        <main className="min-h-screen p-4 sm:p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
