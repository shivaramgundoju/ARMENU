import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import 'aframe';
import 'ar.js/aframe/build/aframe-ar.js';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'a-scene': any;
      'a-marker': any;
      'a-entity': any;
      'a-camera-static': any;
    }
  }
}

export default function ARViewer() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [modelUrl, setModelUrl] = useState<string | null>(null);

  useEffect(() => {
    // Get the model URL from query parameters
    const url = searchParams.get("model");
    if (url) {
      setModelUrl(url);
    } else {
      // Fallback: Margherita pizza GLB hosted online
      setModelUrl(
        "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Avocado/glTF/Avocado.gltf"
      );
    }
  }, [searchParams]);

  if (!modelUrl) {
    return (
      <div className="w-full h-screen flex flex-col justify-center items-center">
        <p className="text-xl text-muted-foreground mb-4">
          No 3D model found
        </p>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="w-full h-screen relative">
      {/* Back Button */}
      <Button
        variant="outline"
        className="absolute top-4 left-4 z-50"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="mr-2" /> Back
      </Button>

      {/* AR Scene */}
      <a-scene
        embedded
        vr-mode-ui="enabled: false"
        arjs="sourceType: webcam; debugUIEnabled: false;"
        style={{ width: "100%", height: "100%" }}
      >
        {/* Marker */}
        <a-marker preset="hiro">
          {/* 3D Model */}
          <a-entity
            gltf-model={modelUrl}
            scale="0.5 0.5 0.5"
            position="0 0 0"
            rotation="0 180 0"
          ></a-entity>
        </a-marker>

        {/* AR Camera */}
        <a-camera-static></a-camera-static>
      </a-scene>
    </div>
  );
}
