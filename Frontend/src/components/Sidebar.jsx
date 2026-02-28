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
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-gray-900 border-b border-gray-700 flex items-center justify-between px-4">
        <div className="text-lg font-semibold text-orange-400 truncate">
          {role === "admin" ? "Admin Panel" : "User Panel"}
        </div>
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="text-white text-3xl leading-none"
          aria-label="Toggle sidebar"
        >
          {isOpen ? <HiX /> : <HiMenu />}
        </button>
      </header>

      <aside
        className={`fixed md:static top-14 md:top-0 left-0 z-50 w-64 h-[calc(100vh-56px)] md:h-screen bg-gray-900 text-white transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="hidden md:block p-6 text-2xl font-bold text-orange-400">
          {role === "admin" ? "Admin Panel" : "User Panel"}
        </div>

        <nav className="flex flex-col h-full overflow-y-auto py-4 md:py-0">
          <div className="flex-1">
            {links.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `block px-6 py-3 hover:bg-gray-800 transition-colors duration-200 rounded-md mx-2 my-1 ${
                    isActive ? "bg-gray-800 text-orange-400 font-semibold" : ""
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          <div className="p-4">
            <Link
              to="/"
              className="block w-full text-center bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg px-4 py-2 transition"
            >
              Go Back
            </Link>
          </div>
        </nav>
      </aside>

      {isOpen && (
        <button
          className="fixed inset-0 top-14 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
          aria-label="Close sidebar"
        />
      )}
    </>
  );
};

export default Sidebar;
