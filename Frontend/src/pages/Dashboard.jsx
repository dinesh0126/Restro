import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { adminDashboardApi } from "../api/productapi";

const PIE_COLORS = ["#22c55e", "#f59e0b", "#3b82f6", "#ef4444", "#a855f7"];

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const result = await adminDashboardApi();
        setDashboardData(result?.data || null);
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const metrics = dashboardData?.metrics || {
    totalOrders: 0,
    revenue: 0,
    customers: 0,
    menuItems: 0,
  };

  const weeklyTrend = dashboardData?.weeklyTrend || [];
  const statusSummary = dashboardData?.statusSummary || [];
  const recentOrders = dashboardData?.recentOrders || [];

  const statusData = statusSummary.map((item) => ({
    name: item.status,
    value: item.value,
  }));

  const getStatusClass = (status) => {
    const value = (status || "").toLowerCase();
    if (value === "delivered") return "text-green-400";
    if (value === "confirmed") return "text-blue-400";
    if (value === "pending") return "text-yellow-400";
    return "text-red-400";
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-orange-400">Admin Dashboard</h1>
        <div className="text-gray-300">Loading dashboard data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-orange-400 mb-2">Admin Dashboard</h1>
        <p className="text-gray-300">Live overview of orders, revenue, and performance.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-gray-900 p-5 rounded-xl shadow">
          <h2 className="text-gray-400 text-sm">Total Orders</h2>
          <p className="text-2xl font-bold text-white mt-2">{metrics.totalOrders}</p>
        </div>
        <div className="bg-gray-900 p-5 rounded-xl shadow">
          <h2 className="text-gray-400 text-sm">Revenue</h2>
          <p className="text-2xl font-bold text-white mt-2">
            ${Number(metrics.revenue || 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-gray-900 p-5 rounded-xl shadow">
          <h2 className="text-gray-400 text-sm">Customers</h2>
          <p className="text-2xl font-bold text-white mt-2">{metrics.customers}</p>
        </div>
        <div className="bg-gray-900 p-5 rounded-xl shadow">
          <h2 className="text-gray-400 text-sm">Menu Items</h2>
          <p className="text-2xl font-bold text-white mt-2">{metrics.menuItems}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-gray-900 p-5 rounded-xl shadow xl:col-span-2">
          <h2 className="text-gray-400 text-lg mb-4">Orders This Week</h2>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={weeklyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="day" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="orders" stroke="#f97316" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-900 p-5 rounded-xl shadow">
          <h2 className="text-gray-400 text-lg mb-4">Order Status</h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" outerRadius={90} label>
                {statusData.map((entry, index) => (
                  <Cell key={`${entry.name}-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-gray-900 p-5 rounded-xl shadow overflow-x-auto">
        <h2 className="text-gray-400 text-lg mb-4">Recent Orders</h2>
        <table className="min-w-[640px] w-full text-left">
          <thead>
            <tr className="text-gray-400 uppercase text-xs sm:text-sm border-b border-gray-700">
              <th className="p-3">Customer</th>
              <th className="p-3">Item</th>
              <th className="p-3">Total</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.length === 0 ? (
              <tr>
                <td className="p-3 text-gray-400" colSpan={4}>
                  No recent orders found.
                </td>
              </tr>
            ) : (
              recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-gray-700 hover:bg-gray-800 transition">
                  <td className="p-3 text-sm sm:text-base">{order.customer}</td>
                  <td className="p-3 text-sm sm:text-base">{order.item}</td>
                  <td className="p-3 text-sm sm:text-base">${order.totalPrice || 0}</td>
                  <td className={`p-3 font-semibold text-sm sm:text-base ${getStatusClass(order.status)}`}>
                    {order.status}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
