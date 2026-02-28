import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authstore";
import { logoutApi } from "../api/authApi";
import toast from "react-hot-toast";

export default function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { role, isAuthenticated, clearUser } = useAuthStore();

  const removeHandler = async () => {
    try {
      await logoutApi();
      clearUser();
      toast.success("Logout successful");
      navigate("/login");
    } catch (error) {
      console.error(error);
      toast.error("Failed to logout");
    }
  };

  const dashboardPath = role === "admin" ? "/admin" : "/user";

  return (
    <nav className="sticky top-0 z-40 border-b border-slate-700/50 bg-slate-950/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-2xl font-extrabold tracking-tight text-amber-400">
          RestoHub
        </Link>

        <div className="hidden items-center gap-5 md:flex">
          <Link to="/" className="text-slate-200 transition hover:text-amber-400">Home</Link>
          <Link to="/menu" className="text-slate-200 transition hover:text-amber-400">Menu</Link>

          {isAuthenticated && (
            <Link to={dashboardPath} className="text-slate-200 transition hover:text-amber-400">
              Dashboard
            </Link>
          )}

          {isAuthenticated ? (
            <button
              onClick={removeHandler}
              className="rounded-lg bg-rose-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-rose-600"
            >
              Logout
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="rounded-lg bg-amber-500 px-3 py-2 text-sm font-semibold text-black transition hover:bg-amber-400"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-emerald-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        <button
          onClick={() => setOpen((prev) => !prev)}
          className="rounded-md p-1 text-slate-100 md:hidden"
          aria-label="Toggle menu"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="space-y-2 border-t border-slate-700/40 bg-slate-900/95 px-4 py-3 md:hidden">
          <Link to="/" onClick={() => setOpen(false)} className="block rounded-md px-2 py-2 text-slate-200 hover:bg-slate-800">Home</Link>
          <Link to="/menu" onClick={() => setOpen(false)} className="block rounded-md px-2 py-2 text-slate-200 hover:bg-slate-800">Menu</Link>
          {isAuthenticated && (
            <Link to={dashboardPath} onClick={() => setOpen(false)} className="block rounded-md px-2 py-2 text-slate-200 hover:bg-slate-800">
              Dashboard
            </Link>
          )}

          {isAuthenticated ? (
            <button
              onClick={() => {
                setOpen(false);
                removeHandler();
              }}
              className="w-full rounded-md bg-rose-500 px-3 py-2 text-left text-sm font-semibold text-white"
            >
              Logout
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <Link to="/login" onClick={() => setOpen(false)} className="rounded-md bg-amber-500 px-3 py-2 text-center text-sm font-semibold text-black">
                Login
              </Link>
              <Link to="/register" onClick={() => setOpen(false)} className="rounded-md bg-emerald-500 px-3 py-2 text-center text-sm font-semibold text-white">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
