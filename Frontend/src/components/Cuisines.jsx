import React, { useEffect, useCallback } from "react";
import { getcategories } from "../api/productapi.js";
import useCategorystore from "../store/categorystore.js";

export default function Cuisines() {
  const { setCategories, categories } = useCategorystore();

  const fetchcategores = useCallback(async () => {
    try {
      const result = await getcategories();
      setCategories(result.data);
    } catch (error) {
      console.log("Error while fetching categories", error);
    }
  }, [setCategories]);

  useEffect(() => {
    fetchcategores();
  }, [fetchcategores]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
      <div className="ui-panel rounded-2xl p-6 md:p-8">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-amber-400 mb-8 text-center md:text-left">
        Inspiration for Your First Order
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 justify-items-center">
        {categories.map((cuisine, index) => (
          <div
            key={index}
            className="flex flex-col items-center w-full max-w-[160px] sm:max-w-[180px] md:max-w-[120px] lg:max-w-[140px]"
          >
            <div className="w-full aspect-square rounded-full overflow-hidden border border-slate-600/60 shadow-lg hover:scale-105 transition-transform">
              <img
                src={cuisine.coverimage}
                alt={cuisine.title}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="mt-2 text-slate-300 cursor-pointer font-medium text-center">
              {cuisine.title}
            </p>
          </div>
        ))}
      </div>
      </div>
    </section>
  );
}
