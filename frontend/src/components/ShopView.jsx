import React, { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { Package, ShoppingCart } from "lucide-react";

const ShopView = () => {
  const { user } = useAuth();
  const [userData] = useState(user);

  const navigate = useNavigate();

  return (
    <div className="p-4 md:p-8 bg-[#E3EEFF]/50 min-h-screen">

      <div className="max-w-[1200px] mx-auto mb-8 flex gap-4">
        <button className="px-6 py-3 rounded-2xl bg-[#1B80FD] text-white">
          Overview
        </button>

        <button className="px-6 py-3 rounded-2xl bg-white text-gray-400">
          Orders
        </button>
      </div>

      <div className="max-w-[1200px] mx-auto grid grid-cols-12 gap-6">

        <div className="col-span-12 lg:col-span-8">

          <div className="bg-white rounded-3xl p-6 shadow">

            <h2 className="text-xl font-bold">
              {userData?.shopName || "My Pharmacy"}
            </h2>

            <p className="text-gray-500">
              Owner: {userData?.name}
            </p>

            <div className="mt-4 space-y-1">
              <p><b>Email:</b> {userData?.email}</p>
              <p><b>Phone:</b> {userData?.phoneNumber}</p>
              <p><b>Address:</b> {userData?.address}</p>
              <p><b>License:</b> {userData?.licenseNumber}</p>
              <p><b>GST:</b> {userData?.gstNumber}</p>
            </div>

          </div>

          <div className="bg-white mt-6 rounded-3xl p-6 shadow">
            <div className="flex items-center gap-2 mb-4">
              <ShoppingCart size={18} />
              <h3 className="font-semibold">Recent Orders</h3>
            </div>

            {userData?.orders?.map((order, i) => (
              <div key={i} className="border p-3 rounded mb-2">

                <p><b>Customer:</b> {order.customer}</p>
                <p><b>Items:</b> {order.items?.join(", ")}</p>
                <p><b>Total:</b> ₹{order.total}</p>
                <p><b>Status:</b> {order.status}</p>

              </div>
            ))}

          </div>

        </div>

        <div className="col-span-12 lg:col-span-4">

          <div className="bg-white rounded-3xl p-6 shadow mb-6">
            <h3 className="font-semibold mb-3">Business Overview</h3>

            <p>Total Orders: {userData?.totalOrders || 0}</p>
            <p>Revenue: ₹{userData?.revenue || 0}</p>
            <p>Products: {userData?.productCount || 0}</p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow">
            <div className="flex items-center gap-2 mb-3">
              <Package size={18} />
              <h3 className="font-semibold">Top Products</h3>
            </div>

            {userData?.topProducts?.map((p, i) => (
              <p key={i}>{p}</p>
            ))}

          </div>

        </div>

      </div>

    </div>
  );
};

export default ShopView;