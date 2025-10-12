import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Camera, AlertCircle } from 'lucide-react';

// Import A-Frame and AR.js
import 'aframe';
import 'ar.js/aframe/build/aframe-ar.js';

// Extend JSX namespace for A-Frame elements
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'a-scene': any;
      'a-marker-camera': any;
      'a-entity': any;
      'a-light': any;
      'a-text': any;
      'a-plane': any;
    }
  }
}

const ARViewer = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const modelUrl = searchParams.get('model');

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!modelUrl) {
      setError('No model URL provided. Please select a dish from the menu.');
      setIsLoading(false);
      return;
    }

    // Small delay to allow A-Frame to initialize
    const timer = setTimeout(() => setIsLoading(false), 500);

    return () => clearTimeout(timer);
  }, [modelUrl]);

  const handleBackToMenu = () => {
    navigate('/');
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center space-y-4">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
          <h2 className="text-2xl font-bold text-gray-800">AR Viewer Error</h2>
          <p className="text-gray-600">{error}</p>
          <Button
            onClick={handleBackToMenu}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Menu
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xl font-semibold text-gray-700">Initializing AR Experience...</p>
          <p className="text-gray-500">Please allow camera access when prompted</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black">
      {/* Back Button */}
      <div className="absolute top-4 left-4 z-50">
        <Button
          onClick={handleBackToMenu}
          variant="secondary"
          size="lg"
          className="bg-white/90 hover:bg-white text-gray-800 shadow-lg"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Menu
        </Button>
      </div>

      {/* Instructions */}
      <div className="absolute top-4 right-4 z-50 bg-white/90 rounded-lg p-4 max-w-xs">
        <div className="flex items-center gap-2 mb-2">
          <Camera className="w-5 h-5 text-orange-500" />
          <span className="font-semibold text-gray-800">AR Instructions</span>
        </div>
        <p className="text-sm text-gray-600">
          Point your camera at a Hiro marker (or printed QR marker) to see the 3D dish model.
        </p>
      </div>

      {/* A-Frame AR Scene */}
      <a-scene
        embedded
        arjs="sourceType: webcam; debugUIEnabled: false;"
        vr-mode-ui="enabled: false"
        className="w-full h-screen"
      >
        {/* Marker Camera */}
        <a-marker-camera
          preset="hiro"
          type="pattern"
          url="https://raw.githubusercontent.com/AR-js-org/AR.js/master/data/data/patt.hiro"
        ></a-marker-camera>

        {/* 3D Model */}
        <a-entity
          gltf-model={`url(${modelUrl})`}
          scale="0.3 0.3 0.3"
          position="0 0.1 0"
          rotation="0 0 0"
        ></a-entity>

        {/* Lighting */}
        <a-light type="directional" intensity="1.5" position="1 1 1"></a-light>
        <a-light type="ambient" intensity="0.5"></a-light>
      </a-scene>

      {/* Loading overlay for model */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-white/90 rounded-lg px-4 py-2 shadow-lg">
          <p className="text-sm text-gray-700">Loading 3D model...</p>
        </div>
      </div>
    </div>
  );
};

export default ARViewer;
