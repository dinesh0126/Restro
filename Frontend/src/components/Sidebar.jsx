import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";

const Sidebar = ({ role }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const adminLinks = [
    { name: "Dashboard", path: "/admin" },
    { name: "Category", path: "/admin/category" },
    { name: "Restaurant Items", path: "/admin/restaurant-items" },
    { name: "Orders", path: "/admin/orders" },
  ];

  const userLinks = [
    { name: "Dashboard", path: "/user" },
    { name: "My Orders", path: "/user/orders" },
    { name: "Settings", path: "/user/settings" },
  ];

  const links = role === "admin" ? adminLinks : userLinks;

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-40 flex h-14 items-center justify-between border-b border-slate-700/60 bg-slate-950/90 px-4 backdrop-blur md:hidden">
        <div className="truncate text-lg font-semibold text-amber-400">
          {role === "admin" ? "Admin Panel" : "User Panel"}
        </div>
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="rounded-md p-1 text-white"
          aria-label="Toggle sidebar"
        >
          {isOpen ? <HiX size={26} /> : <HiMenu size={26} />}
        </button>
      </header>

      <aside
        className={`fixed left-0 top-14 z-50 flex h-[calc(100vh-56px)] w-72 flex-col border-r border-slate-700/50 bg-slate-950/95 text-white backdrop-blur transition-transform duration-300 md:fixed md:top-0 md:h-screen md:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="hidden border-b border-slate-700/50 p-6 md:block">
          <div className="text-2xl font-bold text-amber-400">
            {role === "admin" ? "Admin Panel" : "User Panel"}
          </div>
          <p className="mt-1 text-sm text-slate-400">Manage your workspace efficiently</p>
        </div>

        <nav className="flex min-h-0 flex-1 flex-col overflow-y-auto py-4 md:py-5">
          <div className="flex-1 px-3">
            {links.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `mb-2 block rounded-lg px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-amber-500/20 text-amber-300 border border-amber-400/30"
                      : "text-slate-200 hover:bg-slate-800 hover:text-white"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          <div className="px-4 pb-4">
            <Link
              to="/"
              className="block w-full rounded-lg bg-slate-800 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Back To Home
            </Link>
          </div>
        </nav>
      </aside>

      {isOpen && (
        <button
          className="fixed inset-0 top-14 z-40 bg-black/55 md:hidden"
          onClick={() => setIsOpen(false)}
          aria-label="Close sidebar"
        />
      )}
    </>
  );
};

export default Sidebar;
