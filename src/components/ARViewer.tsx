import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import '@google/model-viewer';
import axios from "axios";

// TypeScript fix for <model-viewer>
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': any;
    }
  }
}

const ARViewer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const modelUrl = params.get("model");
  const itemName = params.get("name") || "";

  const [showOrderForm, setShowOrderForm] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [numItems, setNumItems] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleOrderSubmit = async () => {
    if (!customerName || !tableNumber || numItems <= 0) {
      alert("Please fill all fields correctly");
      return;
    }

    setLoading(true);

    try {
      await axios.post("http://localhost:5000/api/orders", {
        customerName,
        tableNumber,
        numItems,
        itemName,
        itemModel: modelUrl,
      });
      alert("Order placed successfully!");
      setShowOrderForm(false);
      setCustomerName("");
      setTableNumber("");
      setNumItems(1);
    } catch (error) {
      console.error(error);
      alert("Failed to place order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen bg-gray-100 flex flex-col items-center">
      {/* Back button */}
      <button
        className="p-2 m-4 bg-primary text-white rounded-md w-32"
        onClick={() => navigate(-1)}
      >
        Back
      </button>

      {/* 3D Model Viewer */}
      {modelUrl ? (
        <model-viewer
          src={modelUrl}
          ar
          auto-rotate
          camera-controls
          style={{ width: "100%", height: "60vh" }}
        />
      ) : (
        <p className="text-xl text-center text-gray-500 mt-20">
          No model selected
        </p>
      )}

      {/* Order Now button */}
      {!showOrderForm && modelUrl && (
        <button
          className="mt-4 px-6 py-3 text-white rounded-md text-lg"
          style={{
            background:
              "linear-gradient(135deg, hsl(var(--hero-gradient-start)), hsl(var(--hero-gradient-end)))",
          }}
          onClick={() => setShowOrderForm(true)}
        >
          Order Now
        </button>
      )}

      {/* Order Form */}
      {showOrderForm && (
        <div className="mt-6 w-full max-w-md p-6 bg-white shadow-md rounded-md">
          <h2 className="text-2xl font-bold mb-4">Place Your Order</h2>

          <div className="mb-3">
            <label className="block mb-1">Item</label>
            <input
              type="text"
              value={itemName}
              readOnly
              className="w-full border rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div className="mb-3">
            <label className="block mb-1">Customer Name</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div className="mb-3">
            <label className="block mb-1">Table Number</label>
            <input
              type="text"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div className="mb-3">
            <label className="block mb-1">Number of Items</label>
            <input
              type="number"
              min={1}
              value={numItems}
              onChange={(e) => setNumItems(parseInt(e.target.value))}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <button
            className="w-full text-white py-2 rounded-md mt-3"
            style={{
              background:
                "linear-gradient(135deg, hsl(var(--hero-gradient-start)), hsl(var(--hero-gradient-end)))",
            }}
            onClick={handleOrderSubmit}
            disabled={loading}
          >
            {loading ? "Placing Order..." : "Submit Order"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ARViewer;
