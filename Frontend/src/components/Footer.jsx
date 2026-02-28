import React from "react";

export default function Footer() {
  return (
    <footer className="mt-8 border-t border-slate-700/50 bg-slate-950/60 backdrop-blur px-4 py-4 text-center text-sm text-slate-400">
      &copy; {new Date().getFullYear()} RestoHub. Crafted for fast ordering and clean operations.
    </footer>
  );
}
