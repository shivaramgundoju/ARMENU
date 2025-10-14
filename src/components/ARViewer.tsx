import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import '@google/model-viewer';

// Fix TypeScript for custom element <model-viewer>
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
  const modelUrl = params.get("model"); // e.g., "/models/pizza.glb"

  return (
    <div className="w-full h-screen bg-gray-100 flex flex-col">
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
          style={{ width: "100%", height: "100%" }}
        />
      ) : (
        <p className="text-xl text-center text-gray-500 mt-20">No model selected</p>
      )}
    </div>
  );
};

export default ARViewer;
