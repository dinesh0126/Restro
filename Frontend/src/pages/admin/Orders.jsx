import React, { useEffect, useState } from "react";
import { orderapi, updateorderApi } from "../../api/productapi";
import toast from "react-hot-toast";

const statusOptions = ["pending", "confirmed", "delivered", "canceled"];

const statusClass = (status) => {
  const value = (status || "").toLowerCase();
  if (value === "delivered") return "text-emerald-400";
  if (value === "confirmed") return "text-sky-400";
  if (value === "pending") return "text-amber-400";
  return "text-rose-400";
};

export default function Orders() {
  const [orders, setOrders] = useState([]);

  const fetchOrder = async () => {
    try {
      const result = await orderapi();
      setOrders(result.data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders");
    }
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      setOrders((prev) =>
        prev.map((order) =>
          order._id === id ? { ...order, status: newStatus } : order
        )
      );

      await updateorderApi(id, newStatus);
      toast.success("Status updated");
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order");
      fetchOrder();
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-amber-400">Manage Orders</h1>

      <div className="grid grid-cols-1 gap-4 md:hidden">
        {orders.length === 0 ? (
          <div className="ui-panel rounded-xl p-4 text-slate-300">No orders found</div>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="ui-panel rounded-xl p-4 space-y-3">
              <div>
                <p className="text-xs text-slate-400">Customer</p>
                <p className="text-sm font-medium text-slate-100">{order.user?.name || order.user || "N/A"}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Items</p>
                <p className="text-sm text-slate-200">{order.items?.map((i) => i.food?.name || i.food).join(", ")}</p>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className={`text-sm font-semibold ${statusClass(order.status)}`}>{order.status}</span>
                <select
                  value={(order.status || "").toLowerCase()}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  className="rounded-md border border-slate-600 bg-slate-900 px-2 py-1 text-sm text-white"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="table-scroll hidden md:block">
        <table className="text-left">
          <thead className="bg-slate-900/70 text-slate-300">
            <tr>
              <th className="p-3">Customer</th>
              <th className="p-3">Items</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-t border-slate-700/60 bg-slate-900/30 hover:bg-slate-800/50">
                <td className="p-3">{order.user?.name || order.user || "N/A"}</td>
                <td className="p-3">{order.items?.map((i) => i.food?.name || i.food).join(", ")}</td>
                <td className={`p-3 font-semibold ${statusClass(order.status)}`}>{order.status}</td>
                <td className="p-3">
                  <select
                    value={(order.status || "").toLowerCase()}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className="rounded-md border border-slate-600 bg-slate-900 px-2 py-1 text-sm text-white"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={4} className="p-4 text-center text-slate-400">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
