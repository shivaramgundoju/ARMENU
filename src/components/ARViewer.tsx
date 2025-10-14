import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import 'aframe';
import 'ar.js/aframe/build/aframe-ar.js';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'a-scene': any;
      'a-entity': any;
      'a-light': any;
    }
  }
}

const ARViewer = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const modelUrl = searchParams.get('model');
  const [error, setError] = useState<string | null>(null);

  // Fix viewport for mobile full-screen
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
    document.head.appendChild(meta);
  }, []);

  useEffect(() => {
    if (!modelUrl) {
      setError('No model URL provided. Please select a dish from the menu.');
      return;
    }

    const requestCameraPermission = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      } catch (err) {
        setError('Camera access is required for AR experience. Please allow camera access and refresh the page.');
      }
    };
    requestCameraPermission();

    const handleSceneError = (event: any) => {
      console.error('A-Frame scene error:', event.detail);
      setError('Failed to initialize AR scene. Please refresh the page and try again.');
    };
    const handleModelError = (event: any) => {
      console.error('Model loading error:', event.detail);
      setError('Failed to load 3D model. Please check your internet connection and try again.');
    };

    document.addEventListener('arjs-video-error', handleSceneError);
    document.addEventListener('arjs-nft-error', handleSceneError);
    document.addEventListener('model-error', handleModelError);

    return () => {
      document.removeEventListener('arjs-video-error', handleSceneError);
      document.removeEventListener('arjs-nft-error', handleSceneError);
      document.removeEventListener('model-error', handleModelError);
    };
  }, [modelUrl]);

  const handleBackToMenu = () => navigate('/');

  // Gesture handling: pinch to scale & swipe to rotate
  useEffect(() => {
    const model = document.getElementById('ar-model');
    if (!model) return;

    let initialDistance = 0;
    let initialScale = 0.3;
    let initialRotation = 0;
    let lastTouchX = 0;

    const parseVector = (value: string) => value.split(' ').map(parseFloat);

    const getDistance = (touches: TouchList) => {
      if (touches.length < 2) return 0;
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      return Math.sqrt(dx * dx + dy * dy);
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        initialDistance = getDistance(e.touches);
        const scaleValues = parseVector(model.getAttribute('scale') as string);
        initialScale = scaleValues[0];
      } else if (e.touches.length === 1) {
        lastTouchX = e.touches[0].clientX;
        const rotationValues = parseVector(model.getAttribute('rotation') as string);
        initialRotation = rotationValues[1];
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (e.touches.length === 2) {
        const newDistance = getDistance(e.touches);
        const scale = initialScale * (newDistance / initialDistance);
        model.setAttribute('scale', `${scale} ${scale} ${scale}`);
      } else if (e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - lastTouchX;
        const rotation = initialRotation + deltaX * 0.5;
        model.setAttribute('rotation', `0 ${rotation} 0`);
      }
    };

    model.addEventListener('touchstart', onTouchStart, { passive: false });
    model.addEventListener('touchmove', onTouchMove, { passive: false });

    return () => {
      model.removeEventListener('touchstart', onTouchStart);
      model.removeEventListener('touchmove', onTouchMove);
    };
  }, []);

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

  return (
    <div className="fixed inset-0 overflow-hidden">
      <a-scene
        embedded
        arjs="trackingMethod: best; sourceType: webcam; debugUIEnabled: false;"
        renderer="antialias: true; alpha: true;"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          margin: 0,
          padding: 0,
          zIndex: 1,
        }}
      >
        <a-entity camera look-controls="enabled: false"></a-entity>

        <a-entity
          id="ar-model"
          gltf-model={`url(${modelUrl})`}
          scale="0.3 0.3 0.3"
          position="0 0 -1.5"
          rotation="0 0 0"
        ></a-entity>

        <a-light type="ambient" intensity="1"></a-light>
        <a-light type="directional" intensity="0.5" position="1 2 1"></a-light>
      </a-scene>

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
