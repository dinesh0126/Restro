import React, { useState, useEffect } from "react";
import {
  getcategories,
  getfooditems,
  addfooditem,
  deletefood,
  updatefooditem,
} from "../../api/productapi";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function Items() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      id: null,
      description: "",
      name: "",
      price: "",
      category: "",
      available: true,
      image: null,
    },
  });

  const watchId = watch("id");

  const getCategory = async () => {
    try {
      const result = await getcategories();
      setCategories(result.data || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const fetchFoodItems = async () => {
    try {
      const result = await getfooditems();
      setItems(result.data || []);
    } catch (error) {
      console.error("Error fetching food items:", error);
    }
  };

  useEffect(() => {
    fetchFoodItems();
    getCategory();
  }, []);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("price", data.price);
      formData.append("category", data.category);
      formData.append("availability", data.available);
      if (data.image && data.image[0]) {
        formData.append("image", data.image[0]);
      }

      if (data.id) {
        await updatefooditem(data.id, formData);
        toast.success("Item updated successfully");
      } else {
        await addfooditem(formData);
        toast.success("Item added successfully");
      }

      reset();
      fetchFoodItems();
    } catch (err) {
      console.error("Error:", err);
      toast.error("Failed to save item");
    }
  };

  const handleEdit = (item) => {
    setValue("id", item._id);
    setValue("description", item.description);
    setValue("name", item.name);
    setValue("price", item.price);
    setValue("category", item.category?._id || item.category);
    setValue("available", item.availability);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    try {
      await deletefood(id);
      toast.success("Item deleted successfully");
      setItems((prevItems) => prevItems.filter((item) => item._id !== id));
    } catch (err) {
      console.error("Error deleting item:", err);
      toast.error("Failed to delete item");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-amber-400">Manage Items</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="ui-panel rounded-xl p-4 md:p-6 space-y-4"
        encType="multipart/form-data"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              placeholder="Item Name"
              {...register("name", { required: "Name is required" })}
              className="w-full rounded-lg border border-slate-600 bg-slate-900/80 p-2.5 text-white"
            />
            {errors.name && <p className="mt-1 text-sm text-rose-400">{errors.name.message}</p>}
          </div>

          <div>
            <input
              type="number"
              placeholder="Price"
              {...register("price", { required: "Price is required" })}
              className="w-full rounded-lg border border-slate-600 bg-slate-900/80 p-2.5 text-white"
            />
            {errors.price && <p className="mt-1 text-sm text-rose-400">{errors.price.message}</p>}
          </div>

          <div className="md:col-span-2">
            <textarea
              placeholder="Description"
              {...register("description", { required: "Description is required" })}
              className="w-full rounded-lg border border-slate-600 bg-slate-900/80 p-2.5 text-white"
            />
            {errors.description && <p className="mt-1 text-sm text-rose-400">{errors.description.message}</p>}
          </div>

          <div>
            <select
              {...register("category", { required: "Category is required" })}
              className="w-full rounded-lg border border-slate-600 bg-slate-900/80 p-2.5 text-white"
            >
              <option value="">-- Select Category --</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.title}
                </option>
              ))}
            </select>
            {errors.category && <p className="mt-1 text-sm text-rose-400">{errors.category.message}</p>}
          </div>

          <input type="file" accept="image/*" {...register("image")} className="w-full rounded-lg border border-slate-600 bg-slate-900/80 p-2.5 text-white" />
        </div>

        <label className="inline-flex items-center gap-2 text-sm text-slate-300">
          <input type="checkbox" {...register("available")} />
          Available
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`rounded-lg bg-emerald-500 px-4 py-2.5 font-semibold text-black transition hover:bg-emerald-400 ${
            isSubmitting ? "opacity-60" : ""
          }`}
        >
          {isSubmitting ? (watchId ? "Updating..." : "Adding...") : watchId ? "Update Item" : "Add Item"}
        </button>
      </form>

      <div className="grid grid-cols-1 gap-4 md:hidden">
        {items.length === 0 ? (
          <div className="ui-panel rounded-xl p-4 text-slate-300">No items found</div>
        ) : (
          items.map((item) => (
            <div key={item._id} className="ui-panel rounded-xl p-4 space-y-3">
              <div>
                <p className="text-xs text-slate-400">Name</p>
                <p className="font-semibold text-slate-100">{item.name}</p>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-300">Rs {item.price}</span>
                <span className="text-slate-400">{item.category?.title || "N/A"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">{item.availability ? "Available" : "Unavailable"}</span>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(item)} className="rounded-md bg-amber-500 px-3 py-1.5 text-sm font-semibold text-black">Edit</button>
                  <button onClick={() => handleDelete(item._id)} className="rounded-md bg-rose-500 px-3 py-1.5 text-sm font-semibold text-white">Delete</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="table-scroll hidden md:block">
        <table className="text-left">
          <thead className="bg-slate-900/70 text-slate-300">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Price</th>
              <th className="p-3">Category</th>
              <th className="p-3">Available</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id} className="border-t border-slate-700/60 bg-slate-900/30 hover:bg-slate-800/50">
                <td className="p-3 text-xs">{item._id}</td>
                <td className="p-3">{item.name}</td>
                <td className="p-3">Rs {item.price}</td>
                <td className="p-3">{item.category?.title}</td>
                <td className="p-3">{item.availability ? "Yes" : "No"}</td>
                <td className="p-3 flex gap-2">
                  <button onClick={() => handleEdit(item)} className="rounded-md bg-amber-500 px-3 py-1.5 text-sm font-semibold text-black">Edit</button>
                  <button onClick={() => handleDelete(item._id)} className="rounded-md bg-rose-500 px-3 py-1.5 text-sm font-semibold text-white">Delete</button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={6} className="p-4 text-center text-slate-400">No items found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
