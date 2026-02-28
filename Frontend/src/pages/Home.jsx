import React from "react";
import { Link } from "react-router-dom";
import Cuisines from "../components/Cuisines";
import Foodpage from "./Foodpage";
export default function Home() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-4 pb-4 pt-6 sm:px-6 md:px-8">
        <div className="relative h-[64vh] min-h-[420px] overflow-hidden rounded-2xl border border-slate-700/60">
          <img
            src="https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=1470&q=80"
            alt="Dish"
            className="absolute inset-0 h-full w-full object-cover object-right opacity-70 transition-transform duration-1000 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/60 to-transparent" />

          <div className="relative z-10 flex h-full items-center px-6 md:px-12">
            <div className="max-w-2xl text-center md:text-left">
              <h1 className="mb-4 text-5xl font-extrabold tracking-tight text-white md:text-6xl">
                RestoHub
              </h1>
              <p className="mb-6 text-lg leading-relaxed text-slate-200 md:text-xl">
                Discover the finest dishes from top restaurants. Order your favorite meals quickly and enjoy culinary delights at your doorstep.
              </p>
              <Link to="/menu">
                <button className="rounded-full bg-amber-500 px-6 py-3 font-semibold text-black transition hover:bg-amber-400">
                  Order Now
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="space-y-8 pb-8">
        <Cuisines />
        <Foodpage />
      </div>
    </>
  );
}
