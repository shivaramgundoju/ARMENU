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
    <div
      className="fixed inset-0 overflow-hidden"
      style={{
        width: '100vw',
        height: '100vh',
        margin: 0,
        padding: 0,
        backgroundColor: 'black'
      }}
    >
      {/* A-Frame AR Scene - Full Screen */}
      <a-scene
        embedded
        arjs="sourceType: webcam; debugUIEnabled: false; trackingMethod: best; patternRatio: 0.75; detectionMode: mono_and_matrix; matrixCodeType: 3x3;"
        vr-mode-ui="enabled: false"
        renderer="antialias: false;"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 1,
          margin: 0,
          padding: 0
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

        {/* Minimal Lighting */}
        <a-light type="ambient" intensity="0.8"></a-light>
      </a-scene>

      {/* Minimal Back Button - Positioned outside camera view */}
      <div className="absolute top-4 left-4 z-50">
        <Button
          onClick={handleBackToMenu}
          variant="secondary"
          size="sm"
          className="bg-black/50 hover:bg-black/70 text-white border-white/20"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
      </div>
    </div>
  );
};

export default ARViewer;
