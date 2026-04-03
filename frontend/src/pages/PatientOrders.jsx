import React, { useState, useEffect } from "react";
import { Package, Clock, Activity, CheckSquare } from "lucide-react";
import { getPatientOrders } from "../api/order";

const PatientOrders = () => {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("active");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const result = await getPatientOrders();
        setOrders(result.data || []);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(order => 
    activeTab === "active" ? order.status === "pending" : order.status === "done"
  );

  return (
    <div className="min-h-screen bg-[#FAFCFF] pt-24 pb-32 px-4">
      <h1 className="text-3xl font-black mb-8">My <span className="text-blue-600">Orders</span></h1>
      {/* Basic list rendering for testing */}
      <div className="space-y-4">
        {filteredOrders.map(order => (
          <div key={order._id} className="p-4 bg-white border rounded-xl">
            Order ID: {order._id} - Status: {order.status}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientOrders;