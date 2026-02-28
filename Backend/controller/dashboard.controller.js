import orderModel from "../models/order.model.js";
import userModel from "../models/user.model.js";
import foodItemModel from "../models/fooditem.model.js";

export const adminDashboardStats = async (req, res, next) => {
  try {
    const [totalOrders, totalCustomers, menuItems, totals] = await Promise.all([
      orderModel.countDocuments(),
      userModel.countDocuments({ role: "user" }),
      foodItemModel.countDocuments(),
      orderModel.aggregate([
        {
          $group: {
            _id: null,
            revenue: {
              $sum: {
                $cond: [{ $eq: ["$status", "canceled"] }, 0, "$totalPrice"],
              },
            },
          },
        },
      ]),
    ]);

    const start = new Date();
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - 6);

    const weeklyOrders = await orderModel.aggregate([
      { $match: { createdAt: { $gte: start } } },
      {
        $group: {
          _id: {
            y: { $year: "$createdAt" },
            m: { $month: "$createdAt" },
            d: { $dayOfMonth: "$createdAt" },
          },
          orders: { $sum: 1 },
        },
      },
      { $sort: { "_id.y": 1, "_id.m": 1, "_id.d": 1 } },
    ]);

    const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const weeklyMap = new Map();

    weeklyOrders.forEach((entry) => {
      const date = new Date(entry._id.y, entry._id.m - 1, entry._id.d);
      weeklyMap.set(date.toDateString(), entry.orders);
    });

    const weeklyTrend = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);

      return {
        day: dayLabels[date.getDay()],
        orders: weeklyMap.get(date.toDateString()) || 0,
      };
    });

    const statusRows = await orderModel.aggregate([
      { $group: { _id: "$status", value: { $sum: 1 } } },
    ]);

    const statusSummary = statusRows.map((row) => ({
      status: row._id,
      value: row.value,
    }));

    const recentOrdersRaw = await orderModel
      .find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("items.food", "name")
      .populate("user", "name email");

    const recentOrders = recentOrdersRaw.map((order) => ({
      id: order._id,
      customer:
        order?.user?.name || order?.user?.email || "Customer unavailable",
      item:
        order.items?.[0]?.food?.name ||
        (order.items?.length ? `${order.items.length} items` : "No item"),
      status: order.status,
      totalPrice: order.totalPrice || 0,
      createdAt: order.createdAt,
    }));

    return res.status(200).json({
      success: true,
      data: {
        metrics: {
          totalOrders,
          revenue: totals[0]?.revenue || 0,
          customers: totalCustomers,
          menuItems,
        },
        weeklyTrend,
        statusSummary,
        recentOrders,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const userDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [metricsRow, weeklyRows, statusRows, recentOrdersRaw] = await Promise.all([
      orderModel.aggregate([
        { $match: { user: userId } },
        {
          $group: {
            _id: null,
            totalOrders: { $sum: 1 },
            totalSpent: {
              $sum: {
                $cond: [{ $eq: ["$status", "canceled"] }, 0, "$totalPrice"],
              },
            },
          },
        },
      ]),
      (() => {
        const start = new Date();
        start.setHours(0, 0, 0, 0);
        start.setDate(start.getDate() - 6);
        return orderModel.aggregate([
          { $match: { user: userId, createdAt: { $gte: start } } },
          {
            $group: {
              _id: {
                y: { $year: "$createdAt" },
                m: { $month: "$createdAt" },
                d: { $dayOfMonth: "$createdAt" },
              },
              orders: { $sum: 1 },
            },
          },
          { $sort: { "_id.y": 1, "_id.m": 1, "_id.d": 1 } },
        ]);
      })(),
      orderModel.aggregate([
        { $match: { user: userId } },
        { $group: { _id: "$status", value: { $sum: 1 } } },
      ]),
      orderModel
        .find({ user: userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("items.food", "name"),
    ]);

    const start = new Date();
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - 6);

    const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const weeklyMap = new Map();
    weeklyRows.forEach((entry) => {
      const date = new Date(entry._id.y, entry._id.m - 1, entry._id.d);
      weeklyMap.set(date.toDateString(), entry.orders);
    });

    const weeklyTrend = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      return {
        day: dayLabels[date.getDay()],
        orders: weeklyMap.get(date.toDateString()) || 0,
      };
    });

    const statusSummary = statusRows.map((row) => ({
      status: row._id,
      value: row.value,
    }));

    const recentOrders = recentOrdersRaw.map((order) => ({
      id: order._id,
      item:
        order.items?.[0]?.food?.name ||
        (order.items?.length ? `${order.items.length} items` : "No item"),
      status: order.status,
      totalPrice: order.totalPrice || 0,
      createdAt: order.createdAt,
    }));

    const totals = metricsRow[0] || { totalOrders: 0, totalSpent: 0 };
    const deliveredCount = statusRows.find((item) => item._id === "delivered")?.value || 0;
    const canceledCount = statusRows.find((item) => item._id === "canceled")?.value || 0;

    return res.status(200).json({
      success: true,
      data: {
        metrics: {
          totalOrders: totals.totalOrders || 0,
          totalSpent: totals.totalSpent || 0,
          deliveredOrders: deliveredCount,
          canceledOrders: canceledCount,
        },
        weeklyTrend,
        statusSummary,
        recentOrders,
      },
    });
  } catch (error) {
    next(error);
  }
};
