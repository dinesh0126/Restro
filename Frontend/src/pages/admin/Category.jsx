import React, { useEffect, useState } from "react";
import { getcategories, addcategoryApi, deletcatrogyapi } from "../../api/productapi";
import toast from "react-hot-toast";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [newImageFile, setNewImageFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const fetchCategories = async () => {
    try {
      const result = await getcategories();
      setCategories(result.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to fetch categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    if (newCategory.trim() === "" || !newImageFile) {
      toast.error("Please enter category name and select an image");
      return;
    }

    const formData = new FormData();
    formData.append("title", newCategory);
    formData.append("coverimage", newImageFile);

    try {
      setLoading(true);
      const result = await addcategoryApi(formData);

      if (result.data && result.data.category) {
        setCategories((prev) => [...prev, result.data.category]);
        toast.success("Category added successfully");
      }
      setNewCategory("");
      setNewImageFile(null);
      setPreview("");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add category");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!id) return toast.error("Invalid category id");

    try {
      setLoading(true);
      await deletcatrogyapi(id);
      setCategories((prev) => prev.filter((cat) => cat._id !== id));
      toast.success("Category removed successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-amber-400">Manage Categories</h1>

      <div className="ui-panel rounded-xl p-4 md:p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            type="text"
            placeholder="Enter category name"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="rounded-lg border border-slate-600 bg-slate-900/80 p-2.5 text-white"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="rounded-lg border border-slate-600 bg-slate-900/80 p-2.5 text-white"
          />
          <button
            onClick={handleAddCategory}
            disabled={loading}
            className={`rounded-lg px-4 py-2.5 font-semibold transition ${
              loading ? "bg-slate-600 text-slate-300" : "bg-amber-500 text-black hover:bg-amber-400"
            }`}
          >
            {loading ? "Adding..." : "Add Category"}
          </button>
        </div>

        {preview && (
          <div>
            <p className="mb-2 text-sm text-slate-400">Preview</p>
            <img src={preview} alt="Preview" className="h-24 w-24 rounded-lg object-cover" />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:hidden">
        {categories.length === 0 ? (
          <div className="ui-panel rounded-xl p-4 text-slate-300">No categories found</div>
        ) : (
          categories.map((cat) => (
            <div key={cat._id} className="ui-panel rounded-xl p-4 space-y-3">
              <img src={cat.coverimage} alt={cat.title} className="h-28 w-full rounded-lg object-cover" />
              <p className="font-semibold text-slate-100">{cat.title}</p>
              <button
                onClick={() => handleDeleteCategory(cat._id)}
                className="rounded-md bg-rose-500 px-3 py-1.5 text-sm font-semibold text-white"
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
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
              <th className="p-3">Image</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat._id} className="border-t border-slate-700/60 bg-slate-900/30 hover:bg-slate-800/50">
                <td className="p-3 text-xs">{cat._id}</td>
                <td className="p-3">{cat.title}</td>
                <td className="p-3">
                  <img src={cat.coverimage} alt={cat.title} className="h-16 w-24 rounded-md object-cover" />
                </td>
                <td className="p-3">
                  <button
                    onClick={() => handleDeleteCategory(cat._id)}
                    className="rounded-md bg-rose-500 px-3 py-1.5 text-sm font-semibold text-white"
                  >
                    {loading ? "Deleting..." : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={4} className="p-4 text-center text-slate-400">
                  No categories found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Category;
