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

    // Request camera permission explicitly
    const requestCameraPermission = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ video: true });
        // Small delay to allow A-Frame to initialize
        const timer = setTimeout(() => setIsLoading(false), 500);
        return () => clearTimeout(timer);
      } catch (err) {
        setError('Camera access is required for AR experience. Please allow camera access and refresh the page.');
        setIsLoading(false);
      }
    };

    requestCameraPermission();

    // Add event listeners for A-Frame scene errors
    const handleSceneError = (event: any) => {
      console.error('A-Frame scene error:', event.detail);
      setError('Failed to initialize AR scene. Please refresh the page and try again.');
    };

    const handleModelError = (event: any) => {
      console.error('Model loading error:', event.detail);
      setError('Failed to load 3D model. Please check your internet connection and try again.');
    };

    // Listen for A-Frame events
    document.addEventListener('arjs-video-error', handleSceneError);
    document.addEventListener('arjs-nft-error', handleSceneError);
    document.addEventListener('model-error', handleModelError);

    return () => {
      document.removeEventListener('arjs-video-error', handleSceneError);
      document.removeEventListener('arjs-nft-error', handleSceneError);
      document.removeEventListener('model-error', handleModelError);
    };
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
    <div className="fixed inset-0 overflow-hidden">
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
          The 3D model should appear in your camera view.
        </p>
      </div>

      {/* A-Frame AR Scene */}
      <a-scene
        embedded
        arjs="sourceType: webcam; debugUIEnabled: false; trackingMethod: best; patternRatio: 0.75;"
        vr-mode-ui="enabled: false"
        className="w-full h-screen"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 1
        }}
      >
        {/* Camera for markerless AR */}
        <a-entity camera></a-entity>

        {/* 3D Model positioned in front of camera */}
        <a-entity
          gltf-model={`url(${modelUrl})`}
          scale="0.3 0.3 0.3"
          position="0 0 -2"
          rotation="0 45 0"
        ></a-entity>

        {/* Lighting */}
        <a-light type="directional" intensity="1.5" position="1 1 1"></a-light>
        <a-light type="ambient" intensity="0.5"></a-light>
      </a-scene>
    </div>
  );
};

export default ARViewer;
