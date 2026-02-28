import { useState, useEffect } from "react";
import { getfooditems } from "../api/productapi.js";
import { Link } from "react-router-dom";

const Foodpage = () => {
  const [fooditem, setfooditem] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchfooditem = async () => {
      try {
        const result = await getfooditems();
        setfooditem(result.data || []);
      } catch (error) {
        console.log("Error while fetching the product data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchfooditem();
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <div className="ui-panel flex min-h-[240px] items-center justify-center rounded-2xl">
          <p className="text-xl font-semibold text-white">Loading Food Items...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
      <div className="ui-panel rounded-2xl p-6 md:p-8 text-white">
        <h1 className="mb-10 text-center text-3xl font-semibold text-amber-400 md:text-left md:text-5xl">
          Our Delicious Food Items
        </h1>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {fooditem.map((food) => (
            <div
              key={food._id}
              className="overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-900/70 shadow-xl transition duration-300 hover:-translate-y-1"
            >
              <img
                src={food.image}
                alt={food.name}
                className="h-52 w-full object-cover"
              />
              <div className="flex flex-col justify-between p-6">
                <div>
                  <h2 className="mb-2 text-2xl font-bold text-white md:text-3xl">{food.name}</h2>
                  <p className="mt-1 line-clamp-3 text-sm text-slate-300 md:text-base">
                    {food.description}
                  </p>
                </div>
                <div className="mt-4 flex flex-col gap-3">
                  <p className="text-lg font-semibold text-emerald-400 md:text-xl">
                    Rs {food.price} / {food.unit || "plate"}
                  </p>
                  <Link to={`/fooditem/${food._id}`}>
                    <button className="w-full rounded-xl bg-amber-500 px-5 py-3 font-semibold text-black transition hover:bg-amber-400">
                      Order Now
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Foodpage;
